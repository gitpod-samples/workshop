const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const Database = require('better-sqlite3');
const path = require('path');

const app = express();
const PORT = 3001;

// Database connection
const dbPath = path.join(__dirname, 'portfolio.db');
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

console.log('✅ Database connected successfully');

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Portfolio Manager API is running',
    database: 'connected'
  });
});

// Get all portfolios
app.get('/api/portfolios', (req, res) => {
  try {
    const stmt = db.prepare('SELECT * FROM portfolios ORDER BY created_at DESC');
    const portfolios = stmt.all();
    res.json(portfolios);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch portfolios' });
  }
});

// Get portfolio by ID with holdings
app.get('/api/portfolios/:id', (req, res) => {
  try {
    const { id } = req.params;
    
    const portfolioStmt = db.prepare('SELECT * FROM portfolios WHERE id = ?');
    const portfolio = portfolioStmt.get(id);
    
    if (!portfolio) {
      return res.status(404).json({ error: 'Portfolio not found' });
    }
    
    const holdingsStmt = db.prepare(`
      SELECT h.*, s.symbol, s.name, s.current_price,
             (h.quantity * s.current_price) as market_value,
             ((s.current_price - h.average_cost) * h.quantity) as total_gain_loss,
             (((s.current_price - h.average_cost) / h.average_cost) * 100) as gain_loss_percent
      FROM holdings h
      JOIN stocks s ON h.stock_id = s.id
      WHERE h.portfolio_id = ? AND h.quantity > 0
      ORDER BY market_value DESC
    `);
    const holdings = holdingsStmt.all(id);
    
    portfolio.holdings = holdings;
    
    // Calculate total portfolio value
    portfolio.total_value = holdings.reduce((sum, h) => sum + parseFloat(h.market_value), 0);
    portfolio.total_cost = holdings.reduce((sum, h) => sum + (parseFloat(h.average_cost) * h.quantity), 0);
    portfolio.total_gain_loss = portfolio.total_value - portfolio.total_cost;
    portfolio.total_gain_loss_percent = portfolio.total_cost > 0 
      ? ((portfolio.total_gain_loss / portfolio.total_cost) * 100) 
      : 0;
    
    res.json(portfolio);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch portfolio' });
  }
});

// Get all stocks
app.get('/api/stocks', (req, res) => {
  try {
    const stmt = db.prepare('SELECT * FROM stocks ORDER BY symbol');
    const stocks = stmt.all();
    res.json(stocks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch stocks' });
  }
});

// Get transactions for a portfolio
app.get('/api/portfolios/:id/transactions', (req, res) => {
  try {
    const { id } = req.params;
    const stmt = db.prepare(`
      SELECT t.*, s.symbol, s.name
      FROM transactions t
      JOIN stocks s ON t.stock_id = s.id
      WHERE t.portfolio_id = ?
      ORDER BY t.transaction_date DESC
      LIMIT 50
    `);
    const transactions = stmt.all(id);
    res.json(transactions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

// Create a transaction (buy or sell)
app.post('/api/transactions', (req, res) => {
  const transaction = db.transaction((data) => {
    const { portfolio_id, stock_id, transaction_type, quantity, price_per_share } = data;
    
    // Insert transaction
    const insertTransaction = db.prepare(`
      INSERT INTO transactions (portfolio_id, stock_id, transaction_type, quantity, price_per_share)
      VALUES (?, ?, ?, ?, ?)
    `);
    const result = insertTransaction.run(portfolio_id, stock_id, transaction_type, quantity, price_per_share);
    
    // Update holdings
    const getHolding = db.prepare(`
      SELECT * FROM holdings WHERE portfolio_id = ? AND stock_id = ?
    `);
    const holding = getHolding.get(portfolio_id, stock_id);
    
    if (transaction_type === 'BUY') {
      if (!holding) {
        // Create new holding
        const insertHolding = db.prepare(`
          INSERT INTO holdings (portfolio_id, stock_id, quantity, average_cost)
          VALUES (?, ?, ?, ?)
        `);
        insertHolding.run(portfolio_id, stock_id, quantity, price_per_share);
      } else {
        // Update existing holding
        const newQuantity = holding.quantity + quantity;
        const newAverageCost = ((holding.quantity * holding.average_cost) + (quantity * price_per_share)) / newQuantity;
        
        const updateHolding = db.prepare(`
          UPDATE holdings
          SET quantity = ?, average_cost = ?
          WHERE portfolio_id = ? AND stock_id = ?
        `);
        updateHolding.run(newQuantity, newAverageCost, portfolio_id, stock_id);
      }
    } else if (transaction_type === 'SELL') {
      if (!holding || holding.quantity < quantity) {
        throw new Error('Insufficient shares to sell');
      }
      
      const newQuantity = holding.quantity - quantity;
      
      const updateHolding = db.prepare(`
        UPDATE holdings
        SET quantity = ?
        WHERE portfolio_id = ? AND stock_id = ?
      `);
      updateHolding.run(newQuantity, portfolio_id, stock_id);
    }
    
    return result.lastInsertRowid;
  });
  
  try {
    const transactionId = transaction(req.body);
    
    // Fetch the created transaction
    const getTransaction = db.prepare('SELECT * FROM transactions WHERE id = ?');
    const createdTransaction = getTransaction.get(transactionId);
    
    res.status(201).json(createdTransaction);
  } catch (err) {
    console.error(err);
    if (err.message === 'Insufficient shares to sell') {
      res.status(400).json({ error: err.message });
    } else {
      res.status(500).json({ error: 'Failed to create transaction' });
    }
  }
});

// Update stock price (simulating market data update)
app.put('/api/stocks/:id/price', (req, res) => {
  try {
    const { id } = req.params;
    const { price } = req.body;
    
    const stmt = db.prepare(`
      UPDATE stocks
      SET current_price = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);
    const result = stmt.run(price, id);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Stock not found' });
    }
    
    const getStock = db.prepare('SELECT * FROM stocks WHERE id = ?');
    const stock = getStock.get(id);
    
    res.json(stock);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update stock price' });
  }
});

app.listen(PORT, () => {
  console.log(`Portfolio Manager API running on http://localhost:${PORT}`);
});
