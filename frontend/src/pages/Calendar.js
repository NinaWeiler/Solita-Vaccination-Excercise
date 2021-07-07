import React, {useState, useEffect} from 'react'
//import {format, parseISO, isBefore, set} from 'date-fns'
import orderService from '../services/orders'



//const initialState = format(new Date(), {representation: 'date'})
const initialDay = '2021-04-07'

const initialState = {
    given: [],
    ordersArrived: [],
}


const Calendar = ({vaccinations, orders}) => {
    //const initialState = format(new Date(), {representation: 'date'})
    //const [given, setGiven] = useState([])
    //const [ordersArrived, setOrdersArrived] = useState([])
    const [state, setState] = useState(initialState)
    const [day, setDay] = useState(initialDay)
    //if (selectedDay === null) { selectedDay = format(new Date(), {representation: 'date'})} 

    //if (selectedDay === null) { selectedDay = format(new Date(), {representation: 'date'})} 

    const vaccinationBrand = (brand) => {
        const data =  state.ordersArrived.filter(v => v.vaccine === brand)
        return data
    } 

    /*
    //make backend call that returns combined data by day not ids
    const expiredToday = (day) => {
        const orderData = orders.filter(o => )
        const data = await orderService.get
    }
    */
    
    useEffect(() => {
        const vaccinationsGiven = vaccinations.filter(v => v.vaccinationDate.startsWith(day))
        //setGiven(vaccinationsGiven)
        const ordersArrived = orders.filter(o => o.arrived.startsWith(day))
        //setOrdersArrived(ordersArrived)
        setState( prevState => ({
            ...prevState,
            given: vaccinationsGiven,
            ordersArrived: ordersArrived
        }))
    }, [day, vaccinations, orders])


    return (
        <div class="container">
        <div class="columns is-vcentered">
            <div class="column is-8">
                <div class="box">
                <p class="has-text-danger-dark is-size-4 has-text-weight-medium">Vaccination status on {day}</p>
                <p>Vaccinations given: {state.given.length}</p>
                <p>Orders arrived: {state.ordersArrived.length}</p>
                <p>Vaccinations expired today: </p>
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