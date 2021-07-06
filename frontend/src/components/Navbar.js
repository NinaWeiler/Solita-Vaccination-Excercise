import React from 'react'

const Navbar = () => {
    return (
        <nav class="navbar is-spaced" role="navigation" aria-label="main navigation">
            <div class="navbar-brand">
                <h1 class="title has-text-danger-dark   ">Vaxxy</h1>
            </div>
            <div class="navbar-end">
                <div class="navbar-item">
                    <a href="#">Home</a>
                </div>
                <div class="navbar-item">
                    <a href="#">Statistics</a>
                </div>
            </div>
        </nav>
    )
}

export default Navbar