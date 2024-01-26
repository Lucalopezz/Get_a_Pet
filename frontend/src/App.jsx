import { useState } from 'react'
import { Outlet } from 'react-router-dom'


import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'


function App() {
  const [count, setCount] = useState(0)

  return (
    <div className='App'>
      <Navbar/>
      <Outlet/>
      <Footer/>
    </div>
  )
}

export default App
