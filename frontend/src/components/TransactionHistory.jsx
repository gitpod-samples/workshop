function TransactionHistory({ transactions }) {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (transactions.length === 0) {
    return (
      <div className="transactions-section">
        <h2>Transaction History</h2>
        <p style={{ color: '#666', padding: '20px 0' }}>No transactions yet.</p>
      </div>
    )
  }

  return (
    <div className="transactions-section">
      <h2>Transaction History</h2>
      {transactions.map((transaction) => (
        <div key={transaction.id} className="transaction-item">
          <div>
            <span className={`transaction-type ${transaction.transaction_type.toLowerCase()}`}>
              {transaction.transaction_type}
            </span>
            <span style={{ marginLeft: '10px', fontWeight: '600' }}>
              {transaction.symbol}
            </span>
            <span style={{ marginLeft: '10px', color: '#666' }}>
              {transaction.name}
            </span>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontWeight: '600' }}>
              {transaction.quantity} shares @ {formatCurrency(transaction.price_per_share)}
            </div>
            <div style={{ fontSize: '0.9rem', color: '#666' }}>
              {formatDate(transaction.transaction_date)}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default TransactionHistory
