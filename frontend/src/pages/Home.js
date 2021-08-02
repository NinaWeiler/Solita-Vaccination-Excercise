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


const Home = ({vaccinations, orders, loading}) => {
    const day = useSelector(selectDay)
    const dispatch = useDispatch()
    const [state, setState] = useState(initialState)
   
    const totalGiven = () => vaccinations.filter(a => isBefore(parseISO((a.vaccinationDate).slice(0, -8)), (addDays(parseISO(day), 1))))
    const totalArrived = () => orders.filter(o => isBefore(parseISO((o.arrived).slice(0, -8)), (addDays(parseISO(day), 1))))
    const ordersToCome = () => orders.filter(o => isAfter((parseISO((o.arrived).slice(0,-8))), (addDays((parseISO(day)), 1))))
    const givenToday = () => vaccinations.filter(v => isSameDay(parseISO((v.vaccinationDate).slice(0, -8)), parseISO(day)))
    const arrivedToday = () => orders.filter(o => isSameDay(parseISO((o.arrived).slice(0, -8)), parseISO(day)))
    const vaccinationBrand = (brand) => {
        const data =  state.totalArrivedBy.filter(v => v.vaccine === brand)
        return data
    }
    
    useEffect(() => {
        async function fetchData()  {
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
        }
        fetchData()
    }, [day, vaccinations, orders])



   console.log(loading)
    return (
        <div class="container">
        <div class="columns is-vcentered">
            <div class="column is-8">
                <div class="box" style={{minHeight: '300px'}}>
                {loading ? <button class="button is-loading is-centered"></button> 
                : 
                <>
                {state.totalArrivedBy.length > 0 ? 
                <>
                <p class="has-text-danger-dark is-size-4 has-text-weight-medium">Vaccination and Order status on {day}</p>
                <p class="has-text-danger-dark is-size-5 ">Vaccinations:</p>
                <p>Vaccinations given in total: {state.totalGivenBy.length}</p>
                <br/>
                <p class="has-text-danger-dark is-size-5 ">Orders:</p>
                <div class='content'>
                <table>
                    <thead>
                        <tr>
                            <th>Brand</th>
                            <th>Injections per bottle</th>
                            <th>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Zerpfy</td>
                            <td>{vaccinationBrand('Zerpfy')[0].injections}</td>
                            <td>{vaccinationBrand('Zerpfy').length}</td>
                        </tr>
                        <tr>
                            <td>Antiqua</td>
                            <td>{vaccinationBrand('Antiqua')[0].injections}</td>
                            <td>{vaccinationBrand('Antiqua').length}</td>
                        </tr>
                        <tr>
                            <td>SolarBuddhica</td>
                            <td>{vaccinationBrand('SolarBuddhica')[0].injections}</td>
                            <td>{vaccinationBrand('SolarBuddhica').length}</td>
                        </tr>
                </tbody>
                <tfoot>
                    <tr style={{fontWeight: 'bold'}}>
                        <td>Total</td>
                        <td></td>
                        <td >{state.totalArrivedBy.length}</td>
                    </tr>
                </tfoot>
                </table>
                </div>
                <p>Orders on their way: {state.ordersToCome.length}</p>
                <p class="has-text-danger-dark is-size-5 has-text-weight-medium">Selected day's numbers:</p>
                <p>Vaccinations given on selected day: {state.givenToday.length}</p>
                <p>Orders arrived on selected day: {state.arrivedToday.length}</p>
                <p class="has-text-danger-dark is-size-5 has-text-weight-medium">Details</p>

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