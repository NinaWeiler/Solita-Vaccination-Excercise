import React, {useState, useEffect} from 'react'
import { parseISO, isBefore, isAfter, addDays, isSameDay, subDays} from 'date-fns'
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
    arrivedToday: [],
    bottlesExpired: []
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
    const bottlesExpired = () => orders.filter(o => isBefore(parseISO((o.arrived).slice(0, -8)), subDays(parseISO(day), 30)))
    const orderBrand = (brand) => {
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
        const expiredBottles = bottlesExpired()
        setState( prevState => ({
            ...prevState,
            totalGivenBy: given,
            totalArrivedBy: arrived,
            givenToday: vaccinationsGiven,
            arrivedToday: ordersArrived,
            ordersToCome: ordersLeft,
            expiredBottles: expiredBottles
        }))
        console.log('fetching done')
        }
        fetchData()
    }, [day, vaccinations, orders])



   console.log(loading)
    return (
        <div class="container">
        <div class="columns">
            <div class="column is-8">
                <div class="box" style={{minHeight: '300px'}}>
                {loading ? <button class="button is-loading is-centered"></button> 
                : 
                <>
                {state.totalArrivedBy.length > 0 ? 
                <>
                <p class="has-text-danger-dark is-size-4 has-text-weight-medium">Vaccination and Order status on {day}</p>
                <table class='table is-hoverable is-narrow'>
                    <thead>
                        <tr>
                            <th></th>
                            <th>On {day}</th>
                            <th>Z</th>
                            <th>A</th>
                            <th>S</th>
                            <th>In total</th>
                        </tr>
                    </thead>
                <tbody>
                        <tr>
                            <td>Orders arrived (bottle)</td>
                            <td>{state.arrivedToday.length}</td>
                            <td>{orderBrand('Zerpfy').length}</td>
                            <td>{orderBrand('Antiqua').length}</td>
                            <td>{orderBrand('SolarBuddhica').length}</td>
                            <td style={{fontWeight: 'bold'}}>{state.totalArrivedBy.length}</td>
                        </tr>
                        <tr>
                            <td>Vaccinations arrived</td>
                            <td></td>
                            <td>{orderBrand('Zerpfy').length * orderBrand('Zerpfy')[0].injections}</td>
                            <td>inj</td>
                            <td>inj</td>
                            <td>n/a</td>
                        </tr>
                        <tr>
                            <td>Vaccinations given</td>
                            <td>{state.givenToday.length}</td>
                            <td></td>
                            <td>n/a</td>
                            <td></td>
                            <td style={{fontWeight: 'bold'}}>{state.totalGivenBy.length}</td>
                        </tr>
                        <tr>
                            <td>Vaccinations left to use</td>
                            <td></td>
                            <td>arrived</td>
                            <td> - injetions</td>
                            <td>used</td>
                        </tr>
                        <tr>
                            <td>Expired bottles</td>
                            <td></td>
                            <td>n/a</td>
                            <td>n/a</td>
                            <td></td>
                            <td style={{fontWeight: 'bold'}}>{state.expiredBottles.length}</td>
                        </tr>
                        <tr>
                            <td>Injections expired before usage</td>
                            <td></td>
                            <td>n/a</td>
                            <td>n/a</td>
                            <td>n/a</td>
                        </tr>
                        <tr>
                            <td>Injections expiring in 10 days</td>
                            <td></td>
                            <td>arrived on date</td>
                            <td>not used</td>
                            <td>n/a</td>
                        </tr>
                        <tr style={{fontWeight: 'bold'}}>
                            <td colSpan='3'>Status on {day}</td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>Orders arrived</td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>Vaccinations given</td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                </tbody>
                <tfoot>
                    <tr style={{fontWeight: 'bold'}}>
                        <td>Total</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                </tfoot>
                </table>
                <p class="has-text-danger-dark is-size-5 ">Vaccinations:</p>
                <p>Make separate tables per brand?</p>
                <table class='table is-hoverable'>
                    <thead>
                        <tr>
                            <th>Brand</th>
                            <th>Given</th>
                            <th>Left to use</th>
                            <th>Expired</th>
                        </tr>
                    </thead>
                <tbody>
                        <tr>
                            <td>Zerpfy</td>
                            <td></td>
                            <td>n/a</td>
                            <td>n/a</td>
                        </tr>
                        <tr>
                            <td>Antiqua</td>
                            <td></td>
                            <td>n/a</td>
                            <td>n/a</td>
                        </tr>
                        <tr>
                            <td>SolarBuddhica</td>
                            <td></td>
                            <td>n/a</td>
                            <td>n/a</td>
                        </tr>
                </tbody>
                <tfoot>
                    <tr style={{fontWeight: 'bold'}}>
                        <td>Total</td>
                        <td>{state.totalGivenBy.length}</td>
                        <td></td>
                        <td></td>
                    </tr>
                </tfoot>
                </table>
                <br/>
                <p class="has-text-danger-dark is-size-5 ">Orders:</p>
                <table class='table is-hoverable'>
                    <thead>
                        <tr>
                        <th colSpan='3' style={{textAlign: 'center'}}>Orders Arrived</th>    
                        </tr>
                    </thead>
                    <thead>
                        <tr>
                            <th>Brand</th>
                            <th>Injections per bottle</th>
                            <th>Bottles</th>
                        </tr>
                    </thead>
                <tbody>
                        <tr>
                            <td>Zerpfy</td>
                            <td>{orderBrand('Zerpfy')[0].injections}</td>
                            <td>{orderBrand('Zerpfy').length}</td>
                        </tr>
                        <tr>
                            <td>Antiqua</td>
                            <td>{orderBrand('Antiqua')[0].injections}</td>
                            <td>{orderBrand('Antiqua').length}</td>
                        </tr>
                        <tr>
                            <td>SolarBuddhica</td>
                            <td>{orderBrand('SolarBuddhica')[0].injections}</td>
                            <td>{orderBrand('SolarBuddhica').length}</td>
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
                <p>Orders on their way: {state.ordersToCome.length}</p>
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