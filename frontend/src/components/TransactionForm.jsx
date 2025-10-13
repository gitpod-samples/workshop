import { useState } from 'react'

function TransactionForm({ stocks, onSubmit }) {
  const [formData, setFormData] = useState({
    stock_id: '',
    quantity: '',
    price_per_share: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    // Auto-fill current price when stock is selected
    if (name === 'stock_id' && value) {
      const stock = stocks.find(s => s.id === parseInt(value))
      if (stock) {
        setFormData(prev => ({
          ...prev,
          price_per_share: stock.current_price
        }))
      }
    }
  }

  const handleSubmit = async (transactionType) => {
    if (!formData.stock_id || !formData.quantity || !formData.price_per_share) {
      alert('Please fill in all fields')
      return
    }

    const success = await onSubmit({
      stock_id: parseInt(formData.stock_id),
      transaction_type: transactionType,
      quantity: parseInt(formData.quantity),
      price_per_share: parseFloat(formData.price_per_share)
    })

    if (success) {
      setFormData({
        stock_id: '',
        quantity: '',
        price_per_share: ''
      })
    }
  }

  return (
    <div className="transaction-form">
      <h2>New Transaction</h2>
      <div className="form-grid">
        <div className="form-group">
          <label>Stock</label>
          <select
            name="stock_id"
            value={formData.stock_id}
            onChange={handleChange}
          >
            <option value="">Select a stock</option>
            {stocks.map(stock => (
              <option key={stock.id} value={stock.id}>
                {stock.symbol} - {stock.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Quantity</label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            min="1"
            placeholder="Number of shares"
          />
        </div>

        <div className="form-group">
          <label>Price per Share</label>
          <input
            type="number"
            name="price_per_share"
            value={formData.price_per_share}
            onChange={handleChange}
            step="0.01"
            min="0.01"
            placeholder="0.00"
          />
        </div>
      </div>

      <div className="button-group">
        <button className="btn-buy" onClick={() => handleSubmit('BUY')}>
          Buy Shares
        </button>
        <button className="btn-sell" onClick={() => handleSubmit('SELL')}>
          Sell Shares
        </button>
      </div>
    </div>
  )
}

export default TransactionForm
