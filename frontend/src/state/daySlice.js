import {createSlice} from '@reduxjs/toolkit'
import { parseISO, format} from 'date-fns'

//reducer for changing selected day in calendar
export const daySlice = createSlice({
    name: 'day',
    initialState: {
        selectedDay: format(parseISO('2021-01-02'), "yyyy-MM-dd")

    },
    reducers: {
        changeDay: (state, action) => {
            state.selectedDay = format(new Date(action.payload), "yyyy-MM-dd")
        }
    }
})

export const { changeDay } = daySlice.actions

export const selectDay = state => state.day.selectedDay

export default daySlice.reducer