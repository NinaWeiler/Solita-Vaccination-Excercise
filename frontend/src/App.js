import React, { useState, useEffect } from 'react'
import vaccinationService from './services/vaccinations'
import Navbar from './components/Navbar'
import Home from './pages/Home'

const App = () => {
  const [vaccinations, setVaccinations] = useState([])
  const [showDay, setShowDay] = useState([])

  useEffect(() => {
    vaccinationService.getAll().then((vaccinations) => setVaccinations(vaccinations))
  }, [])

  const showSelectedDay = (day) => {
    const selectedVaccinations = vaccinations.filter(v => v.vaccinationDate.startsWith(day))
    setShowDay(selectedVaccinations)
  }

  return (
    <>
    <Navbar/>
    <Home/>
    <h>Vaccinations</h>
    <button onClick={() => showSelectedDay('2021-03-07')}>Click</button>
    {showDay.map((vaccination) => (
      <p>{vaccination.gender}</p>
    ))
    }
    </>
  );
}

export default App;
