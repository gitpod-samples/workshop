function HoldingsTable({ holdings }) {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value)
  }

  const formatPercent = (value) => {
    const num = parseFloat(value)
    return `${num >= 0 ? '+' : ''}${num.toFixed(2)}%`
  }

  if (holdings.length === 0) {
    return (
      <div className="holdings-section">
        <h2>Holdings</h2>
        <p style={{ color: '#666', padding: '20px 0' }}>No holdings yet. Start by making your first transaction below.</p>
      </div>
    )
  }

  return (
    <div className="holdings-section">
      <h2>Holdings</h2>
      <div style={{ overflowX: 'auto' }}>
        <table className="holdings-table">
          <thead>
            <tr>
              <th>Symbol</th>
              <th>Name</th>
              <th>Quantity</th>
              <th>Avg Cost</th>
              <th>Current Price</th>
              <th>Market Value</th>
              <th>Gain/Loss</th>
              <th>Return %</th>
            </tr>
          </thead>
          <tbody>
            {holdings.map((holding) => (
              <tr key={holding.id}>
                <td className="stock-symbol">{holding.symbol}</td>
                <td className="stock-name">{holding.name}</td>
                <td>{holding.quantity}</td>
                <td>{formatCurrency(holding.average_cost)}</td>
                <td>{formatCurrency(holding.current_price)}</td>
                <td>{formatCurrency(holding.market_value)}</td>
                <td style={{ color: holding.total_gain_loss >= 0 ? '#10b981' : '#ef4444' }}>
                  {formatCurrency(holding.total_gain_loss)}
                </td>
                <td style={{ color: holding.gain_loss_percent >= 0 ? '#10b981' : '#ef4444' }}>
                  {formatPercent(holding.gain_loss_percent)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default HoldingsTable
