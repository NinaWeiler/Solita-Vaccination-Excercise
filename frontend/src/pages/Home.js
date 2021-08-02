import React, {useState, useEffect} from 'react'
import { parseISO, isBefore, isAfter, addDays, isSameDay} from 'date-fns'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css";
import '../components/CalendarStyle.css'

import {useSelector, useDispatch} from 'react-redux'
import {selectDay, selectedDayThis} from '../state/daySlice'


const initialState = {
    totalGivenBy: [],
    totalArrivedBy:[],
    orderToCome: [],
    givenToday: [],
    arrivedToday: []
}


const Home = ({vaccinations, orders}) => {
    const day = useSelector(selectDay)
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)
    const [state, setState] = useState(initialState)
   
    const totalGiven = () => vaccinations.filter(a => isBefore(parseISO((a.vaccinationDate).slice(0, -8)), (addDays(parseISO(day), 1))))
    const totalArrived = () => orders.filter(o => isBefore(parseISO((o.arrived).slice(0, -8)), (addDays(parseISO(day), 1))))
    const ordersToCome = () => orders.filter(o => isAfter((parseISO((o.arrived).slice(0,-8))), (addDays((parseISO(day)), 1))))
    const givenToday = () => vaccinations.filter(v => isSameDay(parseISO((v.vaccinationDate).slice(0, -8)), parseISO(day)))
    const arrivedToday = () => orders.filter(o => isSameDay(parseISO((o.arrived).slice(0, -8)), parseISO(day)))
    
    
    useEffect(() => {
        async function fetchData()  {
        setLoading(true)
        const given = totalGiven()
        const arrived = totalArrived()
        const vaccinationsGiven = givenToday()
        const ordersArrived = arrivedToday()
        const ordersLeft = ordersToCome()

        setState( prevState => ({
            ...prevState,
            totalGivenBy: given,
            totalArrivedBy: arrived,
            givenToday: vaccinationsGiven,
            arrivedToday: ordersArrived,
            ordersToCome: ordersLeft,
        }))
        console.log('fetching done')
        setLoading(false)
        }
        fetchData()
    }, [day, vaccinations, orders])

    const vaccinationBrand = (brand) => {
        const data =  state.totalArrivedBy.filter(v => v.vaccine === brand)
        return data
    }

   
    return (
        <div class="container">
        <div class="columns is-vcentered">
            <div class="column is-8">
                <div class="box">
                {loading ? <p>Loading data</p> 
                : 
                <>
                <p class="has-text-danger-dark is-size-4 has-text-weight-medium">Vaccination and order total status by {day}</p>
                <p>Vaccinations given in total: {state.totalGivenBy.length}</p>
                {state.totalArrivedBy.length > 0 ? 
                <>
                <p>Orders arrived in total: {state.totalArrivedBy.length}</p>
                <p>Zerpfy: {vaccinationBrand('Zerpfy').length} bottles ({vaccinationBrand('Zerpfy')[0].injections} injections per bottle)</p>
                <p>Antiqua: {vaccinationBrand('Antiqua').length} bottles ({vaccinationBrand('Antiqua')[0].injections} injections per bottle)</p>
                <p>SolarBuddhica: {vaccinationBrand('SolarBuddhica').length} bottles ({vaccinationBrand('SolarBuddhica')[0].injections} injections per bottle)</p>
               
                <p>Total amount of orders on their way: {state.ordersToCome.length}</p>
                <p class="has-text-danger-dark is-size-5 has-text-weight-medium">Selected day's numbers:</p>
                <p>Vaccinations given on selected day: {state.givenToday.length}</p>
                <p>Orders arrived on selected day: {state.arrivedToday.length}</p>
                </>
                : null }
                </>
                }
                </div>
            </div>
            <div class="column">
               <div class="box">
               <p class="has-text-danger-dark is-size-4 has-text-weight-medium">Check status for any day</p>
                <DatePicker 
                selected={parseISO(day)} 
                onChange={(d) => dispatch(selectedDayThis(d.toString()))} 
                inline
                minDate={new Date('2021-01-02')}
                maxDate={new Date('2021-04-13')}
                />
                </div> 
            </div>
        </div>
        </div>
    )
}

export default Home