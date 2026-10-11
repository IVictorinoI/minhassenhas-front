import React from 'react'
import MenuItem from './menuItem'
import MenuTree from './menuTree'

export default props => (
    <ul className='nav sidebar-menu flex-column'>
        <MenuItem path='/' label='Dashboard' icon='dashboard' />
        <MenuItem path='/passwords' label='Senhas' icon='usd' />
    </ul>
)
