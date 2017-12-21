import { combineReducers } from 'redux';
import FlightReducer from './flightreducer';


const rootReducer = combineReducers({
    flights: FlightReducer
});
  
export default rootReducer;