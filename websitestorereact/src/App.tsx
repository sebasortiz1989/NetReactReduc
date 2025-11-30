const products = [
  { name: 'product1', price: 100 },
  { name: 'product2', price: 200 },
  { name: 'product3', price: 300 },
  { name: 'product3', price: 300 },
  { name: 'product3', price: 300 },
]

function App() {
  return (
    <div style={{fontSize: '1.6rem'}}>
      <h1 style={{color: 'red'}}>Re-store</h1>
      <ul>
        {products.map((product, index) => (
          <li key={index}>
            {product.name} - ${product.price}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App
