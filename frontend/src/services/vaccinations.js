import axios from 'axios'
const baseUrl = '/api/vaccinations'

const getAll = async () => {
    const response = await axios.get(baseUrl)
    return response.data
}

const getAllToday = async (day) => {
    const response = await axios.get(baseUrl + '/vaccinated/' + day)
    return response.data
}

export default {getAll, getAllToday}