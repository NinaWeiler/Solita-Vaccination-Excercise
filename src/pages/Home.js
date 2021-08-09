import React, {useState, useEffect} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import {selectDay, changeDay} from '../state/daySlice'
import { parseISO, isBefore, addDays, isSameDay, subDays} from 'date-fns'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css";
import orderService from '../services/orders'
import { Table, DetailsTable } from '../components/Table'
import CircularProgress from '@material-ui/core/CircularProgress';
import Tooltip from '@material-ui/core/Tooltip';
import '../components/Styles.css'
import '../components/CalendarStyle.css'

const initialState = {
    totalGivenBy: [],
    totalArrivedBy:[],
    givenToday: [],
    arrivedToday: [],
    bottlesExpired: [],
    bottlesExpiredToday : [],
    expiresin10Days: 0
}

const initialBrandDetails = {
    zerpfyArrived: {totalOrders: 0, totalInjections: 0, todaysOrders: 0, todaysInjections: 0},
    zerpfyExpired: 0,
    antiquaArrived:{totalOrders: 0, totalInjections: 0, todaysOrders: 0, todaysInjections: 0},
    antiquaExpired: 0, 
    solarBuddhicaArrived: {totalOrders: 0, totalInjections: 0, todaysOrders: 0, todaysInjections: 0},
    solarBuddhicaExpired: 0,
    totalExpiredToday: 0
}

const Home = ({vaccinations, orders, loading}) => {
    const day = useSelector(selectDay)
    const dispatch = useDispatch()
    const [state, setState] = useState(initialState)
    const [brandDetails, setBrandDetails] = useState(initialBrandDetails)
    const [showDetails, setShowDetails] = useState(false)
    const [loadingData, setLoadingData] = useState(false)

    useEffect(() => {
        async function fetchData()  {
             setState( prevState => ({
                ...prevState,
                totalGivenBy: totalGiven(),
                totalArrivedBy: totalArrived(),
                givenToday: givenToday(),
                arrivedToday: arrivedToday(),
                expiredBottles: bottlesExpired(),
                bottlesExpiredToday: bottlesExpiredOnToday(),
            }))
            expiresSoon()
            if (showDetails === true || day === '2021-01-02') {
                countBrandDetails()
            }

        }
        fetchData()

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [day, vaccinations, orders])


    //helper function for adding up values
    const sumReducer = (sum, value) => {
        return sum + value
    } 

    const handleOnClick = () => {
        setShowDetails(!showDetails)
    }
   
    // total vaccinations and orders given and arrived
    const totalGiven = () => vaccinations.filter(a => isBefore(parseISO((a.vaccinationDate).slice(0, -8)), (addDays(parseISO(day), 1))))
    const totalArrived = () => orders.filter(o => isBefore(parseISO((o.arrived).slice(0, -8)), (addDays(parseISO(day), 1))))
    // filter for vaccines  and orders given and arrived on selected day
    const givenToday = () => vaccinations.filter(v => isSameDay(parseISO((v.vaccinationDate).slice(0, -8)), parseISO(day)))
    const arrivedToday = () => orders.filter(o => isSameDay(parseISO((o.arrived).slice(0, -8)), parseISO(day)))
    // filter for orders that arrived at least 30 days ago
    const bottlesExpired = () => orders.filter(o => isBefore(parseISO((o.arrived).slice(0, -8)), subDays(parseISO(day), 29)))
    const bottlesExpiredOnToday = () => orders.filter(o => isSameDay(parseISO((o.arrived).slice(0, -8)), subDays(parseISO(day), 30)))
   
    //count total amount of injections from orders
    const InjectionsArrived = brandDetails.zerpfyArrived.totalInjections + brandDetails.antiquaArrived.totalInjections + brandDetails.solarBuddhicaArrived.totalInjections
    const InjectionsArrivedToday = brandDetails.zerpfyArrived.todaysInjections + brandDetails.antiquaArrived.todaysInjections + brandDetails.solarBuddhicaArrived.todaysInjections

    //filter data for different manufacturers/brands
    const countBrandDetails = () => {
        const orderBrand = (brand) => totalArrived().filter(v => v.vaccine === brand)
        const orderBrandToday = (brand) => arrivedToday().filter(v => v.vaccine === brand)
        const totalInjections = (brand) =>  orderBrand(brand).map(a => a.injections).reduce(sumReducer, 0)
        const todaysInjections = (brand) => orderBrandToday(brand).map(a => a.injections).reduce(sumReducer, 0)
        expiredToday()

        setBrandDetails(prevState => ({
            ...prevState,
            zerpfyArrived: {totalOrders: orderBrand('Zerpfy').length , totalInjections: totalInjections('Zerpfy'), todaysOrders: orderBrandToday('Zerpfy').length, todaysInjections: todaysInjections('Zerpfy')},
            antiquaArrived: {totalOrders: orderBrand('Antiqua').length , totalInjections: totalInjections('Antiqua'), todaysOrders: orderBrandToday('Antiqua').length, todaysInjections: todaysInjections('Antiqua')},
            solarBuddhicaArrived: {totalOrders: orderBrand('SolarBuddhica').length , totalInjections: totalInjections('SolarBuddhica'), todaysOrders: orderBrandToday('SolarBuddhica').length, todaysInjections: todaysInjections('SolarBuddhica')},

        }))
    }

    //filter for orders that arrived 30 days ago
    //api call returns data with amount of vaccines given substracted from the bottles
    const expiredToday = async () => {
        setLoadingData(true)
        const data = await orderService.expiredToday(day)
        const filterBrand = (brand) => data.filter(d => d.vaccine === brand)
        setBrandDetails(prevState => ({
            ...prevState,
            totalExpiredToday: data.map(d => d.expired).reduce(sumReducer, 0),
            zerpfyExpired: filterBrand('Zerpfy').map(v => v.expired).reduce(sumReducer, 0),
            antiquaExpired: filterBrand('Antiqua').map(v => v.expired).reduce(sumReducer, 0),
            solarBuddhicaExpired: filterBrand('SolarBuddhica').map(v => v.expired).reduce(sumReducer, 0)
        }))
        setLoadingData(false)
    }
    
    const expiresSoon = async () => {
        setLoadingData(true)
        const data = await orderService.expiresIn10Days(day)
        setState(prevState =>    ({
            ...prevState, 
            expiresin10Days: data.map(d => d.injections - d.vaccines).reduce(sumReducer, 0)
        }))
        setLoadingData(false)
    } 
        
    return (
        <div class="container">
        <div class="columns is-centered-desktop">
            <div class="column is-8 is-centered-mobile">
                <div class="box">
                {loading ? <div className='spinnerStyle'><CircularProgress color='primary' disableShrink/></div>
                : 
                <>
                {state.totalArrivedBy.length > 0 ? 
                <>
                    <h2 class="has-text-danger-dark is-size-4 has-text-weight-medium mb-6">
                        Status of Orders and Vaccinations &emsp;
                        {loadingData ? <CircularProgress size='1.4rem' color='inherit'/> : null}
                    </h2>
                    <Table state={state} day={day}/>
                    {showDetails ? 
                    <>  
                        <div className='buttonStyle'>
                            <button class='button is-danger is-light' onClick={handleOnClick}>Hide details</button> 
                        </div>
                        <h3 class="has-text-danger-dark is-size-5 mb-3">Details per manufacturer</h3>
                        <DetailsTable state={state} brandDetails={brandDetails} InjectionsArrived={InjectionsArrived}
                            InjectionsArrivedToday={InjectionsArrivedToday} day={day}/>
                    </>
                    :
                        <div className='buttonStyle'>
                        <button class='button is-danger is-light' onClick={handleOnClick}>Show details</button> 
                        </div>
                    }
                </>
                : null }
                </>
                }
                </div>
            </div>
            <div class="column is-4-desktop is-8-tablet is-centered">
               <div class="box" >
                    <Tooltip placement='top' title='Check status for a date in between 02.01.2021 - 12.04.2021' aria-label='Check status for a date in between 02.01.2021 - 13.04.2021' arrow>
                        <div><h2 class="has-text-danger-dark is-size-4 has-text-weight-medium has-text-centered">Select a date</h2></div>
                    </Tooltip>
                <div className='centerCalendar'>
                    <DatePicker 
                    selected={parseISO(day)} 
                    onChange={(d) => dispatch(changeDay(d.toString()))} 
                    inline
                    minDate={new Date('2021-01-02')}
                    maxDate={new Date('2021-04-13')}
                    />
                </div> 
                </div>
            </div>
        </div>
        </div>
    )
}

export default Home
