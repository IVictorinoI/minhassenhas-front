import React from 'react'
import { NavLink } from 'react-router'
export default props => <li className="nav-item"><NavLink to={props.path} end className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}><i className={'nav-icon fa fa-' + props.icon}></i><p>{props.label}</p></NavLink></li>
