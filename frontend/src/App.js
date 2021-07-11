import React, { useState, useEffect } from 'react'
import vaccinationService from './services/vaccinations'
import orderService from './services/orders'
import Navbar from './components/Navbar'
import Home from './pages/Home'
//import ArrivedToday from './components/ArrivedToday'
import Calendar from './pages/Calendar'

//Last order arrived on 2021-04-12 ?
//First order arrived on 
//First vaccination on 2021-01-02
//Last vaccination on 2021-04-12

const App = () => {
  const [vaccinations, setVaccinations] = useState([])
  const [orders, setOrders] = useState([])
  //const [showDay, setShowDay] = useState([])
  const [loading, setLoading] = useState(false)
  //const [combined, setCombined] = useState([])
  //const [load, setLoad] = useState(false)

  
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

  
  /*
  useEffect(() => {
    async function fetchData() {
      setLoad(true)
      const orderData = await orderService.getAll()
      setOrders(orderData)
      const data = await orders.map(o => orderService.getCombinedInfo(o.id))
      //const data = await orderService.getCombinedInfo(orderData[7].id)
      console.log('data', data[7])
      //setCombined(data)
      setLoad(false)
    }
    fetchData()
  }, []) 
  

  const showSelectedDay = (day) => {
    const selectedVaccinations = vaccinations.filter(v => v.vaccinationDate.startsWith(day))
    setShowDay(selectedVaccinations)
  }
  */
  //console.log('order obect', orders[8])
  //console.log('order vaccies', orders[8].vaccinations)

  return (
    <>
    <Navbar/>
    {loading ? <p>Loading data..</p> : null}
    {/*{load ? <p>Fetching combined data</p> : null} */}
    <Home vaccinations={vaccinations} orders={orders}/> 
    <Calendar vaccinations={vaccinations} orders={orders}/>
    {/*<button onClick={() => showSelectedDay('2021-03-07')}>Click</button>
    {showDay.map((vaccination) => (
      <p>{vaccination.gender}</p>
    ))
    } */}
    </>
  );
}

export default App;
