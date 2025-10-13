# Portfolio Manager Workshop

A full-stack finance/equity application for learning Gitpod and dev containers.

## 🚀 Quick Start

### Option 1: Open in Gitpod (Recommended)

Click the button below or prefix the repository URL with `gitpod.io/#`:

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/meysholdt/ona-workshop)

The workspace will automatically:
- Build the dev container with Node.js
- Add PostgreSQL via Dev Container feature
- Install all dependencies via Ona automations
- Initialize the database with sample data
- Start the backend API on port 3001 (gracefully handles DB unavailability)
- Start the frontend on port 3000 (displays helpful error messages)

### Option 2: Local Development

1. Ensure you have Docker and VS Code with the Dev Containers extension installed
2. Clone the repository:
   ```bash
   git clone https://github.com/meysholdt/ona-workshop.git
   cd ona-workshop
   ```
3. Open in VS Code and reopen in container when prompted
4. Services will start automatically

## 📚 Workshop Guide

Follow the comprehensive workshop guide in [WORKSHOP.md](./WORKSHOP.md) to learn:

1. **Exercise 1:** Open and explore the development environment
2. **Exercise 2:** Make code changes and see live updates
3. **Exercise 3:** Connect via SSH CLI
4. **Exercise 4:** Customize the dev container

## 🏗️ Architecture

- **Frontend:** React + Vite (Port 3000) - Gracefully handles backend/DB errors
- **Backend:** Node.js + Express (Port 3001) - Fails gracefully without DB
- **Database:** PostgreSQL (Port 5432) - Added via Dev Container feature

## 📁 Project Structure

```
ona-workshop/
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

## 🛠️ Manual Setup

Services are managed by Ona automations. To start them:

```bash
# Load automations configuration
gitpod automations update .ona/automations.yaml

# Install dependencies
gitpod automations task start install-dependencies

# Start services
gitpod automations service start database
gitpod automations service start backend
gitpod automations service start frontend

# Check status
gitpod automations service list

# View logs
gitpod automations service logs backend
gitpod automations service logs frontend
```

**Note:** The database service requires a container rebuild to configure PostgreSQL authentication properly. Until then, the app demonstrates graceful failure handling - the backend and frontend run normally and display helpful error messages about the database being unavailable.

## 🔧 Useful Commands

```bash
# View automation status
gitpod automations service list
gitpod automations task list-executions

# Connect to database
psql -U portfolio_user -d portfolio_db

# Check running services
ps aux | grep node

# Test API
curl http://localhost:3001/api/health
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