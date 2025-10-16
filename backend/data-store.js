const fs = require('fs');
const path = require('path');

class DataStore {
  constructor(filePath) {
    this.filePath = filePath;
    this.data = {
      portfolios: [],
      stocks: [],
      transactions: [],
      holdings: [],
      nextId: {
        portfolios: 1,
        stocks: 1,
        transactions: 1,
        holdings: 1
      }
    };
    
    this.load();
  }

  load() {
    if (fs.existsSync(this.filePath)) {
      try {
        this.data = JSON.parse(fs.readFileSync(this.filePath, 'utf8'));
      } catch (err) {
        console.warn('Could not load data, starting fresh');
      }
    }
  }

  save() {
    fs.writeFileSync(this.filePath, JSON.stringify(this.data, null, 2), 'utf8');
  }

  // Generic methods
  getAll(table) {
    return this.data[table] || [];
  }

  getById(table, id) {
    return this.data[table].find(item => item.id == id);
  }

  add(table, item) {
    const id = this.data.nextId[table]++;
    const newItem = { id, ...item };
    this.data[table].push(newItem);
    this.save();
    return newItem;
  }

  update(table, id, updates) {
    const item = this.getById(table, id);
    if (item) {
      Object.assign(item, updates);
      this.save();
      return item;
    }
    return null;
  }

  filter(table, predicate) {
    return this.data[table].filter(predicate);
  }
}

module.exports = DataStore;
