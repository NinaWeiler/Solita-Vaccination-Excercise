import React from 'react'
import './Styles.css'
import LocalHospitalIcon from '@material-ui/icons/LocalHospital';

const Navbar = () => {
    return (
        <nav class="navbar is-spaced has-shadow mb-6" role="navigation" aria-label="main navigation">
            <div class="navbar-brand">
                <div class="navbar-item">
                    <LocalHospitalIcon fontSize='large' color='primary'/>
                </div>
                <div class="navbar-item">
                <h1 class="title has-text-danger-dark ">Vaxxy</h1>
                </div>
            </div>
        </nav>
    )
}

export default Navbar