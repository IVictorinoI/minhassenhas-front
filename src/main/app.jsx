import React, { Component } from 'react'

import Header from '../common/template/header'
import SideBar from '../common/template/sideBar'
import Footer from '../common/template/footer'
import Messages from '../common/msg/messages'

export default class App extends Component {
    render() {
        return (
            <div className='app-wrapper'>
                <Header />
                <SideBar />
                <div className='app-main'>
                    {this.props.children}
                </div>
                <Footer />
                <Messages />
            </div>
        )
    }
}
