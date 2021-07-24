import React, { useState, useEffect } from 'react'
import vaccinationService from './services/vaccinations'
import orderService from './services/orders'
import Navbar from './components/Navbar'
import Home from './pages/Home'
//import Calendar from './pages/Calendar'

//Last order arrived on 2021-04-12 ?
//First order arrived on 2021-01-02
//First vaccination on 2021-01-02
//Last vaccination on 2021-04-12

//why was one vaccination given before any orders arrived?

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
    {/*{loading ? <p>Loading data..</p> : null}
    {load ? <p>Fetching combined data</p> : null} */}
    <Home vaccinations={vaccinations} orders={orders}/> 
    </>
  );
}

export default App;
