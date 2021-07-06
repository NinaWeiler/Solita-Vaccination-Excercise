import React, { useState, useEffect } from 'react'
import vaccinationService from './services/vaccinations'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import ArrivedToday from './components/ArrivedToday'
import Calendar from './pages/Calendar'

const App = () => {
  const [vaccinations, setVaccinations] = useState([])
  const [showDay, setShowDay] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function fetchData()  {
      setLoading(true)
      const data = await vaccinationService.getAll()
      setVaccinations(data)
      setLoading(false)
    }
    fetchData()
  }, [])

  const showSelectedDay = (day) => {
    const selectedVaccinations = vaccinations.filter(v => v.vaccinationDate.startsWith(day))
    setShowDay(selectedVaccinations)
  }

  return (
    <>
    <Navbar/>
    {loading ? <p>Loading data..</p> : null}
    <Home vaccinations={vaccinations} selectedDay={'2021-03-07'}/>
    <Calendar vaccinations={vaccinations}/>
    {/*<button onClick={() => showSelectedDay('2021-03-07')}>Click</button>
    {showDay.map((vaccination) => (
      <p>{vaccination.gender}</p>
    ))
    } */}
    </>
  );
}

export default App;
