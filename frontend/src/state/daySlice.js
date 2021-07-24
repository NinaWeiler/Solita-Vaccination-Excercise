import {createSlice} from '@reduxjs/toolkit'

export const daySlice = createSlice({
    name: 'day',
    initialState: {
        selectedDay: new Date('2021-01-03').toString()
    },
    reducers: {
        selectedDay: (state, action) => {
            state.selectedDay = action.payload
        }
    }
})

export const { selectedDay } = daySlice.actions

export const selectDay = state => state.day.selectedDay

export default daySlice.reducer