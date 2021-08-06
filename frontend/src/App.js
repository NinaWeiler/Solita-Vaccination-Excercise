import React, { useState, useEffect } from 'react'
import vaccinationService from './services/vaccinations'
import orderService from './services/orders'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Footer from './components/Footer'


const App = () => {
  const [vaccinations, setVaccinations] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)

  
  useEffect(() => {
    async function fetchData()  {
      setLoading(true)
      const vaccinationData = await vaccinationService.getAll()
      setVaccinations(vaccinationData)
      const orderData = await orderService.getAll()
      setOrders(orderData)
      setLoading(false)
    } 
    fetchData()
  }, []) 

  
  return (
    <>
    <Navbar/>
    <Home vaccinations={vaccinations} orders={orders} loading={loading}/> 
    <Footer />
    </>
  );
}

export default App;
