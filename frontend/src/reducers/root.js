import {combineReducers} from 'redux'
import orderReducer from './orderReducer'
import vaccinationReducer from './vaccinationReducer'

const rootReducer = combineReducers({
    order: orderReducer,
    vaccination: vaccinationReducer
})

export default rootReducer