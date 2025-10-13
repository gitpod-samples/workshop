function PortfolioSummary({ portfolio }) {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value)
  }

  const formatPercent = (value) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`
  }

  return (
    <div className="portfolio-summary">
      <h2>{portfolio.name}</h2>
      <p style={{ color: '#666', marginBottom: '20px' }}>{portfolio.description}</p>
      
      <div className="summary-grid">
        <div className="summary-card">
          <h3>Total Value</h3>
          <div className="value">{formatCurrency(portfolio.total_value || 0)}</div>
        </div>
        
        <div className="summary-card">
          <h3>Total Cost</h3>
          <div className="value">{formatCurrency(portfolio.total_cost || 0)}</div>
        </div>
        
        <div className="summary-card">
          <h3>Total Gain/Loss</h3>
          <div className={`value ${portfolio.total_gain_loss >= 0 ? 'positive' : 'negative'}`}>
            {formatCurrency(portfolio.total_gain_loss || 0)}
          </div>
        </div>
        
        <div className="summary-card">
          <h3>Return</h3>
          <div className={`value ${portfolio.total_gain_loss_percent >= 0 ? 'positive' : 'negative'}`}>
            {formatPercent(portfolio.total_gain_loss_percent || 0)}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PortfolioSummary
