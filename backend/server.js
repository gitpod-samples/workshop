const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const DataStore = require('./data-store');
const path = require('path');

const app = express();
const PORT = 3001;

// Data store
const dataPath = path.join(__dirname, 'portfolio.json');
const store = new DataStore(dataPath);

console.log('✅ Data store initialized');

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
  const portfolios = store.getAll('portfolios');
  res.json(portfolios);
});

// Get portfolio by ID with holdings
app.get('/api/portfolios/:id', (req, res) => {
  const { id } = req.params;
  const portfolio = store.getById('portfolios', id);
  
  if (!portfolio) {
    return res.status(404).json({ error: 'Portfolio not found' });
  }
  
  // Get holdings for this portfolio
  const holdings = store.filter('holdings', h => h.portfolio_id == id && h.quantity > 0);
  
  // Enrich holdings with stock data and calculations
  portfolio.holdings = holdings.map(h => {
    const stock = store.getById('stocks', h.stock_id);
    const marketValue = h.quantity * stock.current_price;
    const totalGainLoss = (stock.current_price - h.average_cost) * h.quantity;
    const gainLossPercent = ((stock.current_price - h.average_cost) / h.average_cost) * 100;
    
    return {
      ...h,
      symbol: stock.symbol,
      name: stock.name,
      current_price: stock.current_price,
      market_value: marketValue,
      total_gain_loss: totalGainLoss,
      gain_loss_percent: gainLossPercent
    };
  }).sort((a, b) => b.market_value - a.market_value);
  
  // Calculate portfolio totals
  portfolio.total_value = portfolio.holdings.reduce((sum, h) => sum + h.market_value, 0);
  portfolio.total_cost = portfolio.holdings.reduce((sum, h) => sum + (h.average_cost * h.quantity), 0);
  portfolio.total_gain_loss = portfolio.total_value - portfolio.total_cost;
  portfolio.total_gain_loss_percent = portfolio.total_cost > 0 
    ? ((portfolio.total_gain_loss / portfolio.total_cost) * 100) 
    : 0;
  
  res.json(portfolio);
});

// Get all stocks
app.get('/api/stocks', (req, res) => {
  const stocks = store.getAll('stocks').sort((a, b) => a.symbol.localeCompare(b.symbol));
  res.json(stocks);
});

// Get transactions for a portfolio
app.get('/api/portfolios/:id/transactions', (req, res) => {
  const { id } = req.params;
  const transactions = store.filter('transactions', t => t.portfolio_id == id);
  
  // Enrich with stock data
  const enriched = transactions.map(t => {
    const stock = store.getById('stocks', t.stock_id);
    return { ...t, symbol: stock.symbol, name: stock.name };
  }).sort((a, b) => new Date(b.transaction_date) - new Date(a.transaction_date))
    .slice(0, 50);
  
  res.json(enriched);
});

// Create a transaction (buy or sell)
app.post('/api/transactions', (req, res) => {
  try {
    const { portfolio_id, stock_id, transaction_type, quantity, price_per_share } = req.body;
    
    // Create transaction
    const transaction = store.add('transactions', {
      portfolio_id,
      stock_id,
      transaction_type,
      quantity,
      price_per_share,
      transaction_date: new Date().toISOString()
    });
    
    // Update holdings
    const holdings = store.filter('holdings', h => h.portfolio_id == portfolio_id && h.stock_id == stock_id);
    const holding = holdings[0];
    
    if (transaction_type === 'BUY') {
      if (!holding) {
        // Create new holding
        store.add('holdings', {
          portfolio_id,
          stock_id,
          quantity,
          average_cost: price_per_share
        });
      } else {
        // Update existing holding
        const newQuantity = holding.quantity + quantity;
        const newAverageCost = ((holding.quantity * holding.average_cost) + (quantity * price_per_share)) / newQuantity;
        store.update('holdings', holding.id, {
          quantity: newQuantity,
          average_cost: newAverageCost
        });
      }
    } else if (transaction_type === 'SELL') {
      if (!holding || holding.quantity < quantity) {
        return res.status(400).json({ error: 'Insufficient shares to sell' });
      }
      
      store.update('holdings', holding.id, {
        quantity: holding.quantity - quantity
      });
    }
    
    res.status(201).json(transaction);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create transaction' });
  }
});

// Update stock price
app.put('/api/stocks/:id/price', (req, res) => {
  try {
    const { id } = req.params;
    const { price } = req.body;
    
    const stock = store.update('stocks', id, {
      current_price: price,
      updated_at: new Date().toISOString()
    });
    
    if (!stock) {
      return res.status(404).json({ error: 'Stock not found' });
    }
    
    res.json(stock);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update stock price' });
  }
});

app.listen(PORT, () => {
  console.log(`Portfolio Manager API running on http://localhost:${PORT}`);
});
