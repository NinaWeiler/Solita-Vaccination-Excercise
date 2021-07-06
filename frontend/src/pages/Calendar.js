import React, {useState, useEffect} from 'react'
import {format, parseISO, isBefore} from 'date-fns'


//const initialState = format(new Date(), {representation: 'date'})
const initialState = '2021-03-07'

const Calendar = ({vaccinations}) => {
    const [given, setGiven] = useState([])
    const [selectedDay, setSelectedDay] = useState(initialState)

    useEffect(() => {
        const result = vaccinations.filter(v => v.vaccinationDate.startsWith(selectedDay))
        setGiven(result)
    }, [selectedDay, vaccinations])


    return (
        <div class="container">
        <div class="columns is-vcentered">
            <div class="column is-8">
                <div class="box">
                <p class="has-text-danger-dark is-size-4 has-text-weight-medium">Vaccination status on {selectedDay}</p>
                <p>Vaccinations given today: {given.length}</p>
                </div>
            </div>
            <div class="column">
               <div class="box">
               <p class="has-text-danger-dark is-size-4 has-text-weight-medium">Check status for any day</p>
                </div> 
            </div>
        </div>
        <div class="columns is-vcentered">
        <div class="column is-8">
            <div class="box">
                <p class="has-text-danger-dark is-size-4 has-text-weight-medium">Order status on {selectedDay}</p>
            </div>
        </div>
        </div>
        </div>
    )
}

export default Calendar