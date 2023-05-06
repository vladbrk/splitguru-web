import { combineReducers } from 'redux'
import receipt from './receipt'

const reducers = combineReducers({
    receipt: receipt
})

export default reducers