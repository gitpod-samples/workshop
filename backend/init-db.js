const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'portfolio.db');
const db = new Database(dbPath);

function initDatabase() {
  try {
    console.log('Initializing SQLite database...');

    // Enable foreign keys
    db.pragma('foreign_keys = ON');

    // Create tables
    db.exec(`
      CREATE TABLE IF NOT EXISTS portfolios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    db.exec(`
      CREATE TABLE IF NOT EXISTS stocks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        symbol TEXT NOT NULL UNIQUE,
        name TEXT NOT NULL,
        current_price REAL NOT NULL,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    db.exec(`
      CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        portfolio_id INTEGER NOT NULL,
        stock_id INTEGER NOT NULL,
        transaction_type TEXT NOT NULL CHECK (transaction_type IN ('BUY', 'SELL')),
        quantity INTEGER NOT NULL,
        price_per_share REAL NOT NULL,
        transaction_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (portfolio_id) REFERENCES portfolios(id) ON DELETE CASCADE,
        FOREIGN KEY (stock_id) REFERENCES stocks(id) ON DELETE CASCADE
      );
    `);

    db.exec(`
      CREATE TABLE IF NOT EXISTS holdings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        portfolio_id INTEGER NOT NULL,
        stock_id INTEGER NOT NULL,
        quantity INTEGER NOT NULL DEFAULT 0,
        average_cost REAL NOT NULL DEFAULT 0,
        UNIQUE(portfolio_id, stock_id),
        FOREIGN KEY (portfolio_id) REFERENCES portfolios(id) ON DELETE CASCADE,
        FOREIGN KEY (stock_id) REFERENCES stocks(id) ON DELETE CASCADE
      );
    `);

    console.log('✅ Database tables created successfully');

    // Insert sample data
    const insertPortfolio = db.prepare(`
      INSERT OR IGNORE INTO portfolios (name, description)
      VALUES (?, ?)
    `);
    
    insertPortfolio.run('My Portfolio', 'Personal investment portfolio');

    const insertStock = db.prepare(`
      INSERT OR IGNORE INTO stocks (symbol, name, current_price)
      VALUES (?, ?, ?)
    `);

    insertStock.run('AAPL', 'Apple Inc.', 178.50);
    insertStock.run('GOOGL', 'Alphabet Inc.', 142.30);
    insertStock.run('MSFT', 'Microsoft Corporation', 378.90);
    insertStock.run('AMZN', 'Amazon.com Inc.', 145.20);
    insertStock.run('TSLA', 'Tesla Inc.', 242.80);

    console.log('✅ Sample data inserted successfully');
    console.log(`✅ Database initialized at: ${dbPath}`);

  } catch (err) {
    console.error('❌ Database initialization error:', err);
    process.exit(1);
  } finally {
    db.close();
  }
}

initDatabase();
