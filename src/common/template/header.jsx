import React from 'react'
import Navbar from './navbar'


export default props => (
    <header className='main-header'>
        <a href='/#/' className='logo'>
            <span className='logo-mini'><b>M</b>S</span>
            <span className='logo-lg'>
                <i className='fa fa-money'></i>
                <font style={({ marginLeft: '0.8rem' })}>Minhas senhas</font>
            </span>        
        </a>
        <nav className='navbar navbar-static-top'>
            <a href className='sidebar-toggle' data-toggle='offcanvas'></a>
            <Navbar />
        </nav>
    </header>
)