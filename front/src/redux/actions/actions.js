import * as CONSTS from '../../config/constants';

export function getFlights(origin, destination){    
    return (dispatch) => {
        let dispatchedError = false;
        if(origin.IATA === destination.IATA)
            dispatch(haveFlightResults([], [], [], origin, destination));
        else{
            dispatch(isLoading(true));
            fetch(`${CONSTS.apiBaseUrl}/flights/${origin.IATA}/${destination.IATA}`)
            .then((response) => {
                //check if the api sent back an exception
                if (!response.ok){
                    dispatchedError = true
                    dispatch(hasError("Sorry, there was a problem loading this page. Please refresh, and try again."));
                }

                return response;
            })
            .then(response => response.json())
            .then(response =>  {
                if(!dispatchedError)
                    dispatch(haveFlightResults(response.Flights, response.Airports, response.Airlines, origin, destination));
            })
            .catch(error => {
                //if api request was successful but the final response dispatch threw and error cathc it here 
                if(!dispatchedError)
                    dispatch(hasError("Sorry, there was a problem loading this page. Please refresh, and try again."));
            });    
        }
    };
}

export function getPopularFlights(){    
    return (dispatch) => {
        let getError = false;
        fetch(`${CONSTS.apiBaseUrl}/popularflights`)
        .then((response) => {
            //check if the api sent back an exception
            //if it errored we just pretend we don't have content - component only renders with data
            if (!response.ok){
                getError = true;
                dispatch(havePopularFlights([]));
            }
            return response;
        })
        .then(response => response.json())
        .then(response =>  {
            if(!getError)
                dispatch(havePopularFlights(response));
        })
        .catch(error => {
            if(!getError)
                dispatch(havePopularFlights([]));
        });    
    };
}



//#######################################################################################################################

function isLoading(){
    return{
        type:CONSTS.ACTIONTYPE_ISLOADING,
        bool:true
    }
}

function hasError(msg, origin, destination){
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

function havePopularFlights(airports)
{
    return{
        type: CONSTS.ACTIONTYPE_HAVEPOPULARFLIGHTS,
        airports
    };
}
