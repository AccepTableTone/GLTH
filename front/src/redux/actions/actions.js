import * as CONSTS from '../../config/constants';

export function getFlights(origin, destination){
    return (dispatch) => {
        if(origin.IATA === destination.IATA)
            dispatch(haveFlightResults([], [], [], origin, destination));
        else{
            dispatch(isLoading(true));
            fetch(`${CONSTS.apiBaseUrl}/flights/${origin.IATA}/${destination.IATA}`)
            .then((response) => {
                if (!response.ok) {
                    dispatch(hasError("Sorry, there was a problem loading this page. Please refresh, and try again."));
                }
                return response;
            })
            .then(response => response.json())
            .then(response =>  {
                dispatch(haveFlightResults(response.Flights, response.Airports, response.Airlines, origin, destination));
            })
            .catch(error => {
                dispatch(hasError("Sorry, there was a problem loading this page. Please refresh, and try again."));
            });    
        }
    };
}


//#######################################################################################################################

function isLoading(){
    return{
        type:CONSTS.ACTIONTYPE_ISLOADING,
        bool:true
    }
}

function hasError(msg){
    return{
        type: CONSTS.ACTIONTYPE_HASERROR,
        errorMessage:msg
    };
}

function haveFlightResults(flights, airports, airlines, origin, destination){
    return{
        type: CONSTS.ACTIONTYPE_DONEFLIGHTSEARCH,
        flights,
        airports,
        airlines,
        origin,
        destination
    };
}
