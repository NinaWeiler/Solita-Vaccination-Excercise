import React, {useState, useEffect} from 'react'
import { parseISO, isBefore, format, isAfter, formatISO, addDays, subDays} from 'date-fns'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css";
//import 'react-datepicker/dist/react-datepicker-cssmodules.css';

//import CalendarComponent from '../components/CalendarStyle'
import CalendarContainer from 'react-datepicker'
import '../components/CalendarStyle.css'



//const selectedDay = format(new Date(), 'yyy-MM-dd')
const initialDay = '2021-02-14'

const initialState = {
    totalGivenBy: [],
    totalArrivedBy:[],
    orderToCome: [],
    givenToday: [],
    arrivedToday: []
}



const Home = ({vaccinations, orders}) => {
    const [loading, setLoading] = useState(false)
    const [state, setState] = useState(initialState)
    const [startDate, setStartDate] = useState(new Date('2021-01-03'))
    const [selectedDay, setSelectedDay] = useState(initialDay)

    useEffect(() => {
        console.log('startDate', startDate)
        console.log('startdateiSO', startDate.toISOString)
        setSelectedDay(format(parseISO(startDate.toISOString()), "yyyy-MM-dd"))
        console.log('selectedday', selectedDay)
    }, [startDate])
 

    //total given and given on selected day don't match!
    //total amount of orders not correct
    const totalGiven = () => vaccinations.filter(a => isBefore(parseISO(a.vaccinationDate), (addDays(parseISO(selectedDay), 1))))
    const totalArrived = () => orders.filter(o => isBefore(parseISO(o.arrived), (addDays(parseISO(selectedDay), 1))))
    const ordersToCome = () => orders.filter(o => isAfter(parseISO(o.arrived), (parseISO(selectedDay))))
    const givenToday = () => vaccinations.filter(v => v.vaccinationDate.startsWith(selectedDay))
    const arrivedToday = () => orders.filter(o => o.arrived.startsWith(selectedDay))
    
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
    }, [selectedDay, vaccinations, orders])

    const vaccinationBrand = (brand) => {
        const data =  state.totalArrivedBy.filter(v => v.vaccine === brand)
        return data
    }

    console.log('ordersTocome', state.ordersToCome)
    console.log('arrivedToday', state.arrivedToday)
    return (
        <div class="container">
        <div class="columns is-vcentered">
            <div class="column is-8">
                <div class="box">
                {loading ? <p>Loading data</p> 
                : 
                <>
                <p class="has-text-danger-dark is-size-4 has-text-weight-medium">Vaccination and order total status by {selectedDay}</p>
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
                selected={startDate} 
                onChange={(date) => setStartDate(date)} 
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