import React from 'react'
import { createRoot } from 'react-dom/client'
import { applyMiddleware, createStore } from 'redux'
import { Provider } from 'react-redux'

import { thunk } from 'redux-thunk'
import { multi, promise } from './main/middleware'

import Routes from './main/routes'
import reducers from './main/reducers'
import consts from './consts'

window.Params = {
    URL_API: consts.API_URL
}

const devTools = window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
const store = applyMiddleware(multi, thunk, promise)(createStore)(reducers, devTools)
createRoot(document.getElementById('app')).render(
    <Provider store={store}>
        <Routes />
    </Provider>
)
