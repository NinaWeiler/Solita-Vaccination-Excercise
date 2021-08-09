import axios from 'axios'
const baseUrl = '/api/orders'


const getAll = async () => {
    const response = await axios.get(baseUrl)
    return response.data
}

const expiresIn10Days = async (day) => {
    const response = await axios.get(baseUrl + '/exp10/' + day)
    return response.data
} 

const expiredToday = async (day) => {
    const response = await axios.get(baseUrl + '/expired/' + day)
    return response.data
}


// eslint-disable-next-line import/no-anonymous-default-export
export default { getAll, expiredToday, expiresIn10Days }