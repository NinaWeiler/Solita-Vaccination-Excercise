import React, { useState } from 'react' 
import KeyboardArrowDownOutlinedIcon from '@material-ui/icons/KeyboardArrowDownOutlined';
import CloseOutlinedIcon from '@material-ui/icons/CloseOutlined';
import Tooltip from '@material-ui/core/Tooltip';
import '../styles/Styles.css'



const Info = () => {
    const [show, setShow] = useState(true)

    const handleOnClick = () => {
        setShow(!show)
    }
 
    return (

                <div>
                    {show ? 
                        <>
                    <div class='content' className='spaceBetween'>
                    <h2 class="has-text-danger-dark is-size-4 has-text-weight-medium mb-3">About Vaxxy</h2>
                    <button class='button' onClick={handleOnClick}>
                        <span>
                        <Tooltip title='Close' aria-label='Close' placement='top' arrow >
                        <CloseOutlinedIcon fontSize='medium' color='primary'/>
                        </Tooltip>
                        </span>
                        </button>
                    </div>
                        <div class='block'>
                            <p>Vaxxy displays information about vaccination orders and vaccinations (given and expired).</p>
                            <ul>
                                <li>A single order is a bottle containing several vaccinations/injections (amount depends on vaccine manufacturer).</li>
                            <li>Injections expire 30 days after the arrival of the source bottle.</li>
                            <li>A bottle is counted as expired if it has arrived at least 30 days before selected date (also empty bottles are counted here).</li>
                            </ul>
                        </div>
                        </>
                    :
                    <div class='content' className='spaceBetween'>
                    <h2 class="has-text-danger-dark is-size-6 has-text-weight-medium" style={{alignSelf:'center'}}>About Vaxxy</h2>
                    <button class='button' onClick={handleOnClick}>
                        <span>
                        <Tooltip title='Show information' aria-label='Show information' placement='top' arrow >
                        <KeyboardArrowDownOutlinedIcon fontSize='medium'  color='primary'/>
                        </Tooltip>
                        </span>
                    </button>
                    </div>
                    
                
                }
                    
                </div>
    )
}

export default Info