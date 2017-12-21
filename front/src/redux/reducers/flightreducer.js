import * as CONSTS from '../../config/constants';
import initialstate from '../../config/initialstate';

export default function(state = initialstate, action){
    switch(action.type){
        case CONSTS.ACTIONTYPE_ISLOADING:
            return{
                ...state,
                isLoading: true,
                hasError:false,
                didFlightSearch: false,
                errorMessage: ''
            };
        case CONSTS.ACTIONTYPE_HASERROR:
            return{
                ...state,
                isLoading: false,
                didFlightSearch: false,
                hasError:true,
                errorMessage: action.errorMessage
            };
        case CONSTS.ACTIONTYPE_DONEFLIGHTSEARCH:
            return{
                ...state,
                isLoading: false,
                hasError:false,
                errorMessage: '',
                airports: action.airports,
                airlines: action.airlines,
                flights: action.flights,
                origin: action.origin,
                destination: action.destination,
                didFlightSearch: true
            };
        default:
            return state;            
    }
}