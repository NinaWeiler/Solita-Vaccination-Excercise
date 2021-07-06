import React, {useState} from 'react'
import format from 'date-fns/formatISO'

const ArrivedToday = ({day, vaccinations}) => {
    const [given, setGiven] = useState([])
    if (day === null) { day = format(new Date(), {representation: 'date'})} 
    
    const givenToday = (day) => {
        const result = vaccinations.filter(v => v.vaccinationDate.startsWith(day))
        setGiven(result)
    }
    
    return (
        <>
        <p>Today is {day}</p>
        <button onClick={() => givenToday(day)}>Show vaccines given today</button>
        {(given.length !== 0) ? 
        given.map(g => <p>{g.sourceBottle}</p>)
        : <p>No vaccines given on selected day</p>
        }
        
        </>
    )
}

export default ArrivedToday