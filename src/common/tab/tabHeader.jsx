import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectTab } from './tabActions'
export default function TabHeader(props) {
    const tab = useSelector(state => state.tab)
    const dispatch = useDispatch()
    if (!tab.visible[props.target]) return null
    return <li className="nav-item"><button type="button" role="tab" aria-selected={tab.selected === props.target} className={'nav-link' + (tab.selected === props.target ? ' active' : '')} onClick={() => dispatch(selectTab(props.target))}><i className={'fa fa-' + props.icon}></i> {props.label}</button></li>
}
