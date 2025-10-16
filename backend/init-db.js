const DataStore = require('./data-store');
const path = require('path');

const dataPath = path.join(__dirname, 'portfolio.json');
const store = new DataStore(dataPath);

console.log('Initializing data store...');

// Add portfolio if none exists
if (store.getAll('portfolios').length === 0) {
  store.add('portfolios', {
    name: 'My Portfolio',
    description: 'Personal investment portfolio',
    created_at: new Date().toISOString()
  });
  console.log('✅ Portfolio created');
}

// Add stocks if none exist
if (store.getAll('stocks').length === 0) {
  store.add('stocks', {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    current_price: 178.50,
    updated_at: new Date().toISOString()
  });
  
  store.add('stocks', {
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    current_price: 142.30,
    updated_at: new Date().toISOString()
  });
  
  store.add('stocks', {
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    current_price: 378.90,
    updated_at: new Date().toISOString()
  });
  
  store.add('stocks', {
    symbol: 'AMZN',
    name: 'Amazon.com Inc.',
    current_price: 145.20,
    updated_at: new Date().toISOString()
  });
  
  store.add('stocks', {
    symbol: 'TSLA',
    name: 'Tesla Inc.',
    current_price: 242.80,
    updated_at: new Date().toISOString()
  });
  
  console.log('✅ Stocks created');
}

console.log(`✅ Data store initialized at: ${dataPath}`);
