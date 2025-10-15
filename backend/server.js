const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

const app = express();
const PORT = 3001;

// Database connection pool
const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'portfolio_db',
  user: 'postgres'
});

// Track database connection status
let dbConnected = false;

// Test database connection with retry logic
async function testDatabaseConnection() {
  try {
    await pool.query('SELECT NOW()');
    if (!dbConnected) {
      dbConnected = true;
      console.log('✅ Database connected successfully');
    }
    return true;
  } catch (err) {
    if (dbConnected) {
      console.warn('⚠️  Database connection lost');
    }
    dbConnected = false;
    return false;
  }
}

// Initial connection attempt
testDatabaseConnection().catch(() => {
  console.warn('⚠️  Initial database connection failed');
  console.warn('⚠️  API will run in degraded mode without database');
  console.warn('⚠️  Will retry connection every 5 seconds...');
});

// Retry connection every 5 seconds if not connected
setInterval(async () => {
  if (!dbConnected) {
    await testDatabaseConnection();
  }
}, 5000);

// Middleware to check database connection
const checkDbConnection = (req, res, next) => {
  if (!dbConnected) {
    return res.status(503).json({ 
      error: 'Database unavailable',
      message: 'The database is not connected. Please ensure PostgreSQL is running and properly configured.',
      details: 'Run "gitpod automations service start database" to start the database service.'
    });
  }
  next();
};

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Health check (doesn't require database)
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Portfolio Manager API is running',
    database: dbConnected ? 'connected' : 'disconnected'
  });
});

// Get all portfolios
app.get('/api/portfolios', checkDbConnection, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM portfolios ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch portfolios' });
  }
});

// Get portfolio by ID with holdings
app.get('/api/portfolios/:id', checkDbConnection, async (req, res) => {
  try {
    const { id } = req.params;
    
    const portfolioResult = await pool.query('SELECT * FROM portfolios WHERE id = $1', [id]);
    if (portfolioResult.rows.length === 0) {
      return res.status(404).json({ error: 'Portfolio not found' });
    }
    
    const holdingsResult = await pool.query(`
      SELECT h.*, s.symbol, s.name, s.current_price,
             (h.quantity * s.current_price) as market_value,
             ((s.current_price - h.average_cost) * h.quantity) as total_gain_loss,
             (((s.current_price - h.average_cost) / h.average_cost) * 100) as gain_loss_percent
      FROM holdings h
      JOIN stocks s ON h.stock_id = s.id
      WHERE h.portfolio_id = $1 AND h.quantity > 0
      ORDER BY market_value DESC
    `, [id]);
    
    const portfolio = portfolioResult.rows[0];
    portfolio.holdings = holdingsResult.rows;
    
    // Calculate total portfolio value
    portfolio.total_value = holdingsResult.rows.reduce((sum, h) => sum + parseFloat(h.market_value), 0);
    portfolio.total_cost = holdingsResult.rows.reduce((sum, h) => sum + (parseFloat(h.average_cost) * h.quantity), 0);
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
app.get('/api/stocks', checkDbConnection, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM stocks ORDER BY symbol');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch stocks' });
  }
});

// Get transactions for a portfolio
app.get('/api/portfolios/:id/transactions', checkDbConnection, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`
      SELECT t.*, s.symbol, s.name
      FROM transactions t
      JOIN stocks s ON t.stock_id = s.id
      WHERE t.portfolio_id = $1
      ORDER BY t.transaction_date DESC
      LIMIT 50
    `, [id]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

// Create a transaction (buy or sell)
app.post('/api/transactions', checkDbConnection, async (req, res) => {
  const client = await pool.connect();
  try {
    const { portfolio_id, stock_id, transaction_type, quantity, price_per_share } = req.body;
    
    await client.query('BEGIN');
    
    // Insert transaction
    const transactionResult = await client.query(`
      INSERT INTO transactions (portfolio_id, stock_id, transaction_type, quantity, price_per_share)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `, [portfolio_id, stock_id, transaction_type, quantity, price_per_share]);
    
    // Update holdings
    const holdingResult = await client.query(`
      SELECT * FROM holdings WHERE portfolio_id = $1 AND stock_id = $2
    `, [portfolio_id, stock_id]);
    
    if (transaction_type === 'BUY') {
      if (holdingResult.rows.length === 0) {
        // Create new holding
        await client.query(`
          INSERT INTO holdings (portfolio_id, stock_id, quantity, average_cost)
          VALUES ($1, $2, $3, $4)
        `, [portfolio_id, stock_id, quantity, price_per_share]);
      } else {
        // Update existing holding
        const holding = holdingResult.rows[0];
        const newQuantity = holding.quantity + quantity;
        const newAverageCost = ((holding.quantity * holding.average_cost) + (quantity * price_per_share)) / newQuantity;
        
        await client.query(`
          UPDATE holdings
          SET quantity = $1, average_cost = $2
          WHERE portfolio_id = $3 AND stock_id = $4
        `, [newQuantity, newAverageCost, portfolio_id, stock_id]);
      }
    } else if (transaction_type === 'SELL') {
      if (holdingResult.rows.length === 0 || holdingResult.rows[0].quantity < quantity) {
        await client.query('ROLLBACK');
        return res.status(400).json({ error: 'Insufficient shares to sell' });
      }
      
      const holding = holdingResult.rows[0];
      const newQuantity = holding.quantity - quantity;
      
      await client.query(`
        UPDATE holdings
        SET quantity = $1
        WHERE portfolio_id = $2 AND stock_id = $3
      `, [newQuantity, portfolio_id, stock_id]);
    }
    
    await client.query('COMMIT');
    res.status(201).json(transactionResult.rows[0]);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: 'Failed to create transaction' });
  } finally {
    client.release();
  }
});

// Update stock price (simulating market data update)
app.put('/api/stocks/:id/price', checkDbConnection, async (req, res) => {
  try {
    const { id } = req.params;
    const { price } = req.body;
    
    const result = await pool.query(`
      UPDATE stocks
      SET current_price = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *
    `, [price, id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Stock not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update stock price' });
  }
});

app.listen(PORT, () => {
  console.log(`Portfolio Manager API running on http://localhost:${PORT}`);
});
