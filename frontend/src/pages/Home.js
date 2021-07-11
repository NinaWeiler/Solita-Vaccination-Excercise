import React, {useState, useEffect} from 'react'
import { parseISO, isBefore, format} from 'date-fns'


const selectedDay = format(new Date(), 'yyy-MM-dd')

const Home = ({vaccinations, orders}) => {
    const [loading, setLoading] = useState(false)
    const [totalGivenBy, setTotalGivenBy] = useState([])
    const [totalArrivedBy, setTotalArrivedBy] = useState([])
    //if (selectedDay === null) { selectedDay = format(new Date(), {representation: 'date'})} 

    useEffect(() => {
        async function fetchData()  {
        setLoading(true)
        const vaccinationsGivenBy = await vaccinations.filter(a => isBefore(parseISO(a.vaccinationDate), parseISO(selectedDay)))
        setTotalGivenBy(vaccinationsGivenBy)
        const ordersArrivedBy = await orders.filter(o => isBefore(parseISO(o.arrived), parseISO(selectedDay)))
        setTotalArrivedBy(ordersArrivedBy)
        setLoading(false)
        }
        fetchData()
    }, [selectedDay, vaccinations, orders])

    const vaccinationBrand = (brand) => {
        const data =  totalArrivedBy.filter(v => v.vaccine === brand)
        return data
    }

    


    return (
        <div class="container">
        <div class="columns is-vcentered">
            <div class="column is-8">
                <div class="box">
                {totalArrivedBy.length === 0 ? <p>Loading data</p> 
                : 
                <>
                <p class="has-text-danger-dark is-size-4 has-text-weight-medium">Vaccination and order status today ({selectedDay})</p>
                <p>Vaccinations given in total: {totalGivenBy.length}</p>
                <p>Orders arrived in total: {totalArrivedBy.length}</p>
                <p>Zerpfy: {vaccinationBrand('Zerpfy').length} bottles ({vaccinationBrand('Zerpfy')[0].injections} injections per bottle)</p>
                <p>Antiqua: {vaccinationBrand('Antiqua').length} bottles ({vaccinationBrand('Antiqua')[0].injections} injections per bottle)</p>
                <p>SolarBuddhica: {vaccinationBrand('SolarBuddhica').length} bottles ({vaccinationBrand('SolarBuddhica')[0].injections} injections per bottle)</p>
                <p>Orders on their way: </p>
                </>
                }
                </div>
            </div>
            <div class="column">
               <div class="box">
               <p class="has-text-danger-dark is-size-4 has-text-weight-medium">Check status for any day</p>
                </div> 
            </div>
        </div>
        </div>
    )
}

export default Home