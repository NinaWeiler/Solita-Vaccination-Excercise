import axios from 'axios'
const baseUrl = '/api/orders'


const getAll = async () => {
    const response = await axios.get(baseUrl)
    return response.data
}

const getAllToday = async (day) => {
    const response = await axios.get(baseUrl + '/vaccinated/' + day)
    return response.data
}

const getCombinedInfo = async (id) => {
    const response = await axios.get(baseUrl + '/combined/' + id)
    return response.data
}

const getOrdersAndInjections = async (day) => {
    const response = await axios.get(baseUrl + '/expanded/' + day)
    return response.data
}

export default {getAll, getAllToday, getCombinedInfo, getOrdersAndInjections}