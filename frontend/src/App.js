import React, { useState, useEffect } from 'react'
import vaccinationService from './services/vaccinations'
import orderService from './services/orders'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import {useSelector, useDispatch} from 'react-redux'
import {selectDay, selectedDayThis} from './state/daySlice'

//import Calendar from './pages/Calendar'

//Last order arrived on 2021-04-12 
//First order arrived on 2021-01-02
//First vaccination on 2021-01-02
//Last vaccination on 2021-04-12


const App = () => {
  const day = useSelector(selectDay)
  const dispatch = useDispatch()
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
    </>
  );
}

export default App;
