import { combineReducers } from 'redux'

import DashboardReducer from '../dashboard/dashboardReducer'
import TabReducer from '../common/tab/tabReducer'
import AuthReducer from '../auth/authReducer'

import PasswordReducer from '../password/passwordReducer'



const rootReducer = combineReducers({
    dashboard: DashboardReducer,
    tab: TabReducer,
    auth: AuthReducer,

    password: PasswordReducer
})

export default rootReducer
