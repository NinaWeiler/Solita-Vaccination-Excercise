import {configureStore} from '@reduxjs/toolkit'
import dayReducer from './state/daySlice'


export default configureStore({
    reducer: {
        day: dayReducer,
    }
})