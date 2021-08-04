import React, {useState, useEffect} from 'react'
import { parseISO, isBefore, isAfter, addDays, isSameDay, subDays} from 'date-fns'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css";
import '../components/CalendarStyle.css'
import orderService from '../services/orders'

import {useSelector, useDispatch} from 'react-redux'
import {selectDay, selectedDayThis} from '../state/daySlice'


const initialState = {
    totalGivenBy: [],
    totalArrivedBy:[],
    orderToCome: [],
    givenToday: [],
    arrivedToday: [],
    bottlesExpired: [],
    bottlesExpiredToday : [],
    expiresin10Days: 0
}

const initialBrandDetails = {
    zerpfyArrived: {totalOrders: 0, totalInjections: 0, todaysOrders: 0, todaysInjections: 0},
    zerpfyGiven: [],
    zerpfyExpired: [],
    antiquaArrived:{totalOrders: 0, totalInjections: 0, todaysOrders: 0, todaysInjections: 0},
    antiquaGiven: [],
    antiquaExpired: [], 
    solarBuddhicaArrived: {totalOrders: 0, totalInjections: 0, todaysOrders: 0, todaysInjections: 0},
    solarBuddhicaGiven: [],
    solarBuddhicaExpired: []
}


const Home = ({vaccinations, orders, loading}) => {
    const day = useSelector(selectDay)
    const dispatch = useDispatch()
    const [state, setState] = useState(initialState)
    const [brandDetails, setBrandDetails] = useState(initialBrandDetails)

    const sumReducer = (sum, value) => {
        return sum + value
    } 
   
    const totalGiven = () => vaccinations.filter(a => isBefore(parseISO((a.vaccinationDate).slice(0, -8)), (addDays(parseISO(day), 1))))
    const totalArrived = () => orders.filter(o => isBefore(parseISO((o.arrived).slice(0, -8)), (addDays(parseISO(day), 1))))
    const ordersToCome = () => orders.filter(o => isAfter((parseISO((o.arrived).slice(0,-8))), (addDays((parseISO(day)), 1))))
    const givenToday = () => vaccinations.filter(v => isSameDay(parseISO((v.vaccinationDate).slice(0, -8)), parseISO(day)))
    const arrivedToday = () => orders.filter(o => isSameDay(parseISO((o.arrived).slice(0, -8)), parseISO(day)))
    const bottlesExpired = () => orders.filter(o => isBefore(parseISO((o.arrived).slice(0, -8)), subDays(parseISO(day), 29)))
    const bottlesExpiredOnToday = () => orders.filter(o => isSameDay(parseISO((o.arrived).slice(0, -8)), subDays(parseISO(day), 30)))
   
   // move inside count brand details
    const orderBrand = (brand) => state.totalArrivedBy.filter(v => v.vaccine === brand)
    const orderBrandToday = (brand) => state.arrivedToday.filter(v => v.vaccine === brand)
    const totalInjections = (brand) =>  orderBrand(brand).map(a => a.injections).reduce(sumReducer, 0)
    const todaysInjections = (brand) => orderBrandToday(brand).map(a => a.injections).reduce(sumReducer, 0)
    // total arrived  O
    // arrived today  X

    const InjectionsArrived = brandDetails.zerpfyArrived.totalInjections + brandDetails.antiquaArrived.totalInjections + brandDetails.solarBuddhicaArrived.totalInjections
    const InjectionsArrivedToday = brandDetails.zerpfyArrived.todaysInjections + brandDetails.antiquaArrived.todaysInjections + brandDetails.solarBuddhicaArrived.totalInjections


    const countBrandDetails = () => {
        

        setBrandDetails(prevState => ({
            ...prevState,
            zerpfyArrived: {totalOrders: orderBrand('Zerpfy').length , totalInjections: totalInjections('Zerpfy'), todaysOrders: orderBrandToday('Zerpfy').length, todaysInjections: todaysInjections('Zerpfy')},
            antiquaArrived: {totalOrders: orderBrand('Antiqua').length , totalInjections: totalInjections('Antiqua'), todaysOrders: orderBrandToday('Antiqua').length, todaysInjections: todaysInjections('Antiqua')},
            solarBuddhicaArrived: {totalOrders: orderBrand('SolarBuddhica').length , totalInjections: totalInjections('SolarBuddhica'), todaysOrders: orderBrandToday('SolarBuddhica').length, todaysInjections: todaysInjections('SolarBuddhica')},

        }))
    }

    
    const expiresSoon = async () => {
        try {
            const data = await orderService.expiresIn10Days(day)
            const amount = data.map(d => d.injections - d.vaccines)
            return amount.reduce(sumReducer, 0)    //? a,b => a+b, 0
        } catch (error) {
            return 0
        }
    } 
    
    //given and expired from backend call
    //expired soon to a different useEffect because it's slower
    
    
    useEffect(() => {
        async function fetchData()  {
            const given = totalGiven()
            const arrived = totalArrived()
            const vaccinationsGiven = givenToday()
            const ordersArrived = arrivedToday()
            const ordersLeft = ordersToCome()
            const expiredBottles = bottlesExpired()
            const bottlesExpiredToday = bottlesExpiredOnToday()
            //const expiresIn10Days = await expiresSoon()
            countBrandDetails()
            setState( prevState => ({
                ...prevState,
                totalGivenBy: totalGiven(),
                totalArrivedBy: arrived,
                givenToday: vaccinationsGiven,
                arrivedToday: ordersArrived,
                ordersToCome: ordersLeft,
                expiredBottles: expiredBottles,
                bottlesExpiredToday: bottlesExpiredToday,
                //expiresin10Days: expiresIn10Days
            }))
            console.log('fetching done')
        }
        fetchData()
    }, [day, vaccinations, orders])

    /*
    const combinedInfo = async () => {
        const data = await Promise.all(state.arrivedToday.map(async a => {
            const result = await orderService.getCombinedInfo(a.id)
            return result
        }
        ))
        console.log('data', data)
    }

    /*
    let fullInfo
    const getFullInfo = async () => {
        const data = await Promise.all(state.orders.map(async a => {
            const result = await orderService.getFullInfo(a.id)
            return result
        }))
        fullInfo = data.length
        console.log('info', data.length)
    } 
    console.log('combined', combinedInfo()) */

    
        const d = subDays(parseISO(day), 30)
        console.log('d', d)
    //total vaccinations = order * injections

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
                            <th>In total</th>
                        </tr>
                    </thead>
                <tbody>
                        <tr>
                            <td>Orders arrived (bottle)</td>
                            <td>{state.arrivedToday.length}</td>
                            
                            <td style={{fontWeight: 'bold'}}>{state.totalArrivedBy.length}</td>
                        </tr>
                        <tr>
                            <td>Injections in bottles</td>
                            <td>{InjectionsArrived}</td>
                            <td>{InjectionsArrivedToday}</td>
                        </tr>
                        <tr>
                            <td>Vaccinations given</td>
                            <td>{state.givenToday.length}</td>
                            
                            <td style={{fontWeight: 'bold'}}>{state.totalGivenBy.length}</td>
                        </tr>
                        
                        <tr>
                            <td>Expired bottles</td>
                            <td>{state.bottlesExpiredToday.length}</td>
                            <td style={{fontWeight: 'bold'}}>{state.expiredBottles.length}</td>
                        </tr>
                        <tr>
                            <td>Injections expiring in 10 days</td>
                            
                            <td></td>
                            {/*<td style={{fontWeight: 'bold'}}>{state.expiresin10Days}</td>*/}
                        </tr>
                </tbody>
                </table>
                <p class="has-text-danger-dark is-size-5 ">Details per producer for {day}:</p>
                <table class='table is-hoverable'>
                    <thead>
                        <tr>
                            <th></th>
                            <th>Zerpfy</th>
                            <th>Aniqua</th>
                            <th>SolarBuddhica</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                <tbody>
                        <tr>
                            <td>Orders arrived Total</td>
                            <td>{brandDetails.zerpfyArrived.totalOrders}</td>
                            <td>{brandDetails.antiquaArrived.totalOrders}</td>
                            <td>{brandDetails.solarBuddhicaArrived.totalOrders}</td>
                        </tr>
                        <tr>
                            <td>Vaccinations arrived Total</td>
                            <td>{brandDetails.zerpfyArrived.totalInjections}</td>
                            <td>{brandDetails.antiquaArrived.totalInjections}</td>
                            <td>{brandDetails.solarBuddhicaArrived.totalInjections}</td>
                        </tr>
                        <tr>
                            <td>Orders today</td>
                            <td>{brandDetails.zerpfyArrived.todaysOrders}</td>
                            <td>{brandDetails.antiquaArrived.todaysOrders}</td>
                            <td>{brandDetails.solarBuddhicaArrived.todaysOrders}</td>
                        </tr>
                        <tr>
                            <td>Injections today</td>
                            <td>{brandDetails.zerpfyArrived.todaysInjections}</td>
                            <td>{brandDetails.antiquaArrived.todaysInjections}</td>
                            <td>{brandDetails.solarBuddhicaArrived.todaysInjections}</td>
                        </tr>
                        <tr>
                            <td>Given</td>
                            <td></td>
                            <td>n/a</td>
                            <td>n/a</td>
                        </tr>
                        <tr>
                            <td>Expired</td>
                            <td></td>
                            <td>n/a</td>
                            <td>n/a</td>
                        </tr>
                        <tr>
                            <td>Left to use</td>
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