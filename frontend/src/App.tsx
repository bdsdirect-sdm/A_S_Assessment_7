import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import Products from './components/Products'
import Cart from './components/Cart'
import Checkout from './components/Checkout'

function App() {

  return (
    <>
    <Router>
      <Routes>
        <Route path="/" element={ <Products /> } />
        <Route path="cart" element={ <Cart /> } />
        <Route path="/checkout" element={ <Checkout /> } />
      </Routes>
    </Router>
    </>
  )
}

export default App
