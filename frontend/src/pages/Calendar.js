import React, {useState, useEffect} from 'react'
import {subDays, parseISO, format, isBefore} from 'date-fns'
import orderService from '../services/orders'



//const initialDay = format(new Date(), 'yyy-MM-dd')
const initialDay = format(parseISO('2021-02-02'), 'yyyy-MM-dd')
console.log(new Date())

const initialState = {
    given: [],
    ordersArrived: [],
    expiredToday: 0,
    expiredTotal: 0
}


const Calendar = ({vaccinations, orders}) => {
    const [state, setState] = useState(initialState)
    const [day, setDay] = useState(initialDay)
    /*
    const vaccinationBrand = (brand) => {
        const data =  state.ordersArrived.filter(v => v.vaccine === brand)
        return data
    } 
    */

    const givenToday = () => { return vaccinations.filter(v => v.vaccinationDate.startsWith(day))}
    const arrivedToday = () => { return orders.filter(o => o.arrived.startsWith(day))}
    
    // bottle expires 30 day after arrival
    // get amount of unused injections from bottles that arrived 30 days ago
    const expiredToday = async (day) => {
        //day 30 days before selectedDay
        const arrivalDay = format(subDays(parseISO(day), 30), 'yyyy-MM-dd').toString()
        const data = await orderService.getOrdersAndInjections(arrivalDay)
        return data.reduce((amount, order) => amount + (order.injections - order.vaccines.length), 0)
    }

    const expiredTotal = async () => {
        // all days that are at least 30 days before selected day
        // call expiredToday with all the dates and return the sum
        const latestArrivalDay = format(subDays(parseISO(day), 29), 'yyyy-MM-dd').toString()
        console.log('latestArivalDAy', latestArrivalDay)
        const days = orders.filter(o => isBefore(parseISO(o.arrived), parseISO(latestArrivalDay)))
        console.log('days', days[0])
        const result = days.map(d => expiredToday(d.arrived))
        /*
        const result = await Promise.all(days.map(async day => {
            const data = await orderService.getOrdersAndInjections(day.arrived.toString())
            return data.reduce((amount, order) => amount + (order.injections - order.vaccines.length), 0)
        })) */
        console.log('result', result[0])
        return 1    
    }

    //figure out how to not call this three times

    /*
    useEffect(() => {
        async function fetchData() {
            const vaccinationsGiven = givenToday()
            const ordersArrived = arrivedToday()
            const expired = await expiredToday()
            console.log('fetched')
            setState( prevState => ({
                ...prevState,
                given: vaccinationsGiven,
                ordersArrived: ordersArrived,
                expiredToday: expired
            }))
        }
        fetchData()
    }, [day, vaccinations, orders])
    */

    const fetchData = async() => {
        const vaccinationsGiven = await givenToday()
        const ordersArrived = await arrivedToday()
        const expired = await expiredToday(day)
        //const totalExpired = await expiredTotal()
        const totalExpired = 8
        setState( prevState => ({
            ...prevState,
            given: vaccinationsGiven,
            ordersArrived: ordersArrived,
            expiredToday: expired,
            expiredTotal: totalExpired
        }))
        console.log('fetched')

    }

    useEffect(() => {
        fetchData()
    }, [day, orders])


    return (
        <div class="container">
        <div class="columns is-vcentered">
            <div class="column is-8">
                <div class="box">
                <p class="has-text-danger-dark is-size-4 has-text-weight-medium">Vaccination status on {format(parseISO(day), 'EEEE, MMMM do yyyy')}</p>
                <p>Vaccinations given: {state.given.length}</p>
                <p>Orders arrived: {state.ordersArrived.length}</p>
                <p>Vaccinations expired by today in total: {state.expiredTotal} </p>
                <p>Vaccinations expired today: {state.expiredToday} </p>
                <p>Orders arriving tomorrow: </p>
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
                <p class="has-text-danger-dark is-size-4 has-text-weight-medium">Exra box for fun</p>
            </div>
        </div>
        </div>
        </div>
    )
}

export default Calendar