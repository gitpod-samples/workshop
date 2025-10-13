import { useState, useEffect } from 'react'
import PortfolioSummary from './components/PortfolioSummary'
import HoldingsTable from './components/HoldingsTable'
import TransactionForm from './components/TransactionForm'
import TransactionHistory from './components/TransactionHistory'

function App() {
  const [portfolio, setPortfolio] = useState(null)
  const [stocks, setStocks] = useState([])
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [dbError, setDbError] = useState(null)

  const portfolioId = 1 // Using first portfolio for demo

  const handleApiError = async (response) => {
    if (response.status === 503) {
      const errorData = await response.json()
      setDbError(errorData)
      return true
    }
    return false
  }

  const fetchPortfolio = async () => {
    try {
      const response = await fetch(`/api/portfolios/${portfolioId}`)
      if (await handleApiError(response)) return
      if (!response.ok) throw new Error('Failed to fetch portfolio')
      const data = await response.json()
      setPortfolio(data)
      setDbError(null)
    } catch (err) {
      if (!dbError) setError(err.message)
    }
  }

  const fetchStocks = async () => {
    try {
      const response = await fetch('/api/stocks')
      if (await handleApiError(response)) return
      if (!response.ok) throw new Error('Failed to fetch stocks')
      const data = await response.json()
      setStocks(data)
      setDbError(null)
    } catch (err) {
      if (!dbError) setError(err.message)
    }
  }

  const fetchTransactions = async () => {
    try {
      const response = await fetch(`/api/portfolios/${portfolioId}/transactions`)
      if (await handleApiError(response)) return
      if (!response.ok) throw new Error('Failed to fetch transactions')
      const data = await response.json()
      setTransactions(data)
      setDbError(null)
    } catch (err) {
      if (!dbError) setError(err.message)
    }
  }

  const handleTransaction = async (transactionData) => {
    try {
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...transactionData,
          portfolio_id: portfolioId
        })
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create transaction')
      }
      
      // Refresh data
      await Promise.all([fetchPortfolio(), fetchTransactions()])
      return true
    } catch (err) {
      setError(err.message)
      return false
    }
  }

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      await Promise.all([fetchPortfolio(), fetchStocks(), fetchTransactions()])
      setLoading(false)
    }
    loadData()
  }, [])

  if (loading) {
    return (
      <div className="app">
        <div className="loading">Loading portfolio data...</div>
      </div>
    )
  }

  return (
    <div className="app">
      <header>
        <h1>📊 Portfolio Manager</h1>
        <p>Track your equity investments and portfolio performance</p>
      </header>

      {dbError && (
        <div className="db-error-banner">
          <div className="db-error-content">
            <div className="db-error-icon">⚠️</div>
            <div>
              <h3>Database Connection Required</h3>
              <p>{dbError.message}</p>
              <p className="db-error-details">{dbError.details}</p>
              <button 
                className="retry-button" 
                onClick={() => {
                  setDbError(null)
                  setLoading(true)
                  Promise.all([fetchPortfolio(), fetchStocks(), fetchTransactions()])
                    .finally(() => setLoading(false))
                }}
              >
                Retry Connection
              </button>
            </div>
          </div>
        </div>
      )}

      {error && !dbError && (
        <div className="error">
          {error}
          <button onClick={() => setError(null)} style={{ marginLeft: '10px' }}>Dismiss</button>
        </div>
      )}

      {!dbError && portfolio && (
        <>
          <PortfolioSummary portfolio={portfolio} />
          <HoldingsTable holdings={portfolio.holdings || []} />
          <TransactionForm stocks={stocks} onSubmit={handleTransaction} />
          <TransactionHistory transactions={transactions} />
        </>
      )}

      {!dbError && !portfolio && !loading && (
        <div className="empty-state">
          <h2>Welcome to Portfolio Manager</h2>
          <p>Start by ensuring the database is connected and initialized.</p>
        </div>
      )}
    </div>
  )
}

export default App
