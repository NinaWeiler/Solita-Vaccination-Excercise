import * as types from './actionTypes'
import axios from 'axios'
const baseUrl = '/api/orders'


export const getAllOrdersSuccess = (orders) => {
    return {
        type: types.GET_ALL_ORDERS_SUCCCESS,
        payload: orders
    }
}

export const getAllOrders = () => async (dispatch) => {
    const response = await axios.get(baseUrl)
    dispatch(getAllOrdersSuccess(response.data))
}