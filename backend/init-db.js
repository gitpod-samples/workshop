const { Client } = require('pg');

const client = new Client({
  host: 'localhost',
  port: 5432,
  database: 'portfolio_db',
  user: 'postgres'
});

async function initDatabase() {
  try {
    await client.connect();
    console.log('Connected to PostgreSQL');

    // Create tables
    await client.query(`
      CREATE TABLE IF NOT EXISTS portfolios (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS stocks (
        id SERIAL PRIMARY KEY,
        symbol VARCHAR(10) NOT NULL UNIQUE,
        name VARCHAR(255) NOT NULL,
        current_price DECIMAL(10, 2) NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS transactions (
        id SERIAL PRIMARY KEY,
        portfolio_id INTEGER REFERENCES portfolios(id) ON DELETE CASCADE,
        stock_id INTEGER REFERENCES stocks(id) ON DELETE CASCADE,
        transaction_type VARCHAR(10) NOT NULL CHECK (transaction_type IN ('BUY', 'SELL')),
        quantity INTEGER NOT NULL,
        price_per_share DECIMAL(10, 2) NOT NULL,
        transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS holdings (
        id SERIAL PRIMARY KEY,
        portfolio_id INTEGER REFERENCES portfolios(id) ON DELETE CASCADE,
        stock_id INTEGER REFERENCES stocks(id) ON DELETE CASCADE,
        quantity INTEGER NOT NULL DEFAULT 0,
        average_cost DECIMAL(10, 2) NOT NULL DEFAULT 0,
        UNIQUE(portfolio_id, stock_id)
      );
    `);

    console.log('Database tables created successfully');

    // Insert sample data
    const portfolioResult = await client.query(`
      INSERT INTO portfolios (name, description)
      VALUES ('My Portfolio', 'Personal investment portfolio')
      ON CONFLICT DO NOTHING
      RETURNING id;
    `);

    await client.query(`
      INSERT INTO stocks (symbol, name, current_price)
      VALUES 
        ('AAPL', 'Apple Inc.', 178.50),
        ('GOOGL', 'Alphabet Inc.', 142.30),
        ('MSFT', 'Microsoft Corporation', 378.90),
        ('AMZN', 'Amazon.com Inc.', 145.20),
        ('TSLA', 'Tesla Inc.', 242.80)
      ON CONFLICT (symbol) DO NOTHING;
    `);

    console.log('Sample data inserted successfully');

  } catch (err) {
    console.error('Database initialization error:', err);
  } finally {
    await client.end();
  }
}

initDatabase();
