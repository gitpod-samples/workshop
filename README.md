# Portfolio Manager Workshop

A full-stack finance/equity application for learning Gitpod and dev containers.

## 📚 Workshop Guide

Follow the comprehensive workshop guide in [WORKSHOP.md](./WORKSHOP.md) to learn:

## 🏗️ Architecture

- **Frontend:** React + Vite (Port 3000)
- **Backend:** Node.js + Express (Port 3001)
- **Database:** SQLite (better-sqlite3) - Embedded database stored in `backend/portfolio.db`

## 📁 Project Structure

```
workshop/
├── .devcontainer/
│   ├── devcontainer.json    # Dev container configuration
│   └── Dockerfile            # Container image definition
├── .ona/
│   └── automations.yaml      # Ona automations configuration
├── backend/
│   ├── server.js             # Express API server
│   ├── init-db.js            # Database initialization
│   └── package.json          # Backend dependencies
├── frontend/
│   ├── src/
│   │   ├── App.jsx           # Main React component
│   │   ├── components/       # React components
│   │   └── index.css         # Styles
│   ├── index.html            # HTML entry point
│   ├── vite.config.js        # Vite configuration
│   └── package.json          # Frontend dependencies
├── WORKSHOP.md               # Workshop exercises
└── README.md                 # This file
```

## 🎯 Features

- **Portfolio Management:** Create and track investment portfolios
- **Stock Trading:** Buy and sell stocks with real-time calculations
- **Performance Metrics:** View gain/loss, returns, and portfolio value
- **Transaction History:** Complete audit trail of all trades
- **Responsive Design:** Works on desktop and mobile devices

## 🔧 Useful Commands

```bash
# View automation status
gitpod automations service list
gitpod automations task list-executions

# Initialize/reset database
cd backend && node init-db.js

# Check running services
ps aux | grep node

# Test API
curl http://localhost:3001/api/health

# View database file
ls -lh backend/portfolio.db
```

## 📖 API Endpoints

- `GET /api/health` - Health check
- `GET /api/portfolios` - List all portfolios
- `GET /api/portfolios/:id` - Get portfolio with holdings
- `GET /api/stocks` - List all available stocks
- `GET /api/portfolios/:id/transactions` - Get transaction history
- `POST /api/transactions` - Create a new transaction
- `PUT /api/stocks/:id/price` - Update stock price

## 🤝 Contributing

This is a workshop project. Feel free to fork and experiment!

## 📝 License

MIT License - feel free to use this for learning and teaching.

---

**Ready to start?** Open [WORKSHOP.md](./WORKSHOP.md) and begin with Exercise 1!