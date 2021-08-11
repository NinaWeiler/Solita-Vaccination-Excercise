import React from 'react'
import { useSelector, useDispatch } from "react-redux";
import { selectDay, changeDay } from "../state/daySlice";
import { parseISO } from "date-fns";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../styles/Styles.css";
import "../styles/CalendarStyle.css";
import Tooltip from "@material-ui/core/Tooltip";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";


const Calendar = () => {
    const day = useSelector(selectDay);
    const dispatch = useDispatch();
    return (
        <div class="box">
              <div className='boxStyle'>
            <Tooltip
              placement="top"
              title="Check status for a date in between 02.01.2021 - 12.04.2021"
              aria-label="Check status for a date in between 02.01.2021 - 13.04.2021"
              arrow
            >
              <div>
                <h2 class="has-text-danger-dark is-size-4 has-text-weight-medium has-text-centered">
                  Select a date <InfoOutlinedIcon fontSize="small" />
                </h2>
              </div>
            </Tooltip>
            <div className="centerCalendar">
              <DatePicker
                selected={parseISO(day)}
                onChange={(d) => dispatch(changeDay(d.toString()))}
                inline
                minDate={new Date("2021-01-02")}
                maxDate={new Date("2021-04-13")}
              />
            </div>
            </div>
        </div>
    )
}

export default Calendar