import {createSlice} from '@reduxjs/toolkit'
import { parseISO, format} from 'date-fns'



export const daySlice = createSlice({
    name: 'day',
    initialState: {
        selectedDay: format(parseISO('2021-01-03'), "yyyy-MM-dd")

    },
    reducers: {
        selectedDayThis: (state, action) => {
            state.selectedDay = format(new Date(action.payload), "yyyy-MM-dd")
        }
    }
})

export const { selectedDayThis } = daySlice.actions

export const selectDay = state => state.day.selectedDay

export default daySlice.reducer