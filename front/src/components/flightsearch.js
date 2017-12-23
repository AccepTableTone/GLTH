//react
import React from 'react';
//project
import Loader from './loader';
import FlightList from './flightlist';
import SearchForm from './searchform';

const FlightSearch = (props) => {
    return(
        <div className="search-container">
            <div className="searchform-container">
                <SearchForm searchFlights={(orig, dest) => props.searchFlights(orig, dest)}/>
            </div>
            {
                props.state.isLoading
                    ?
                        <Loader/>
                    :
                        <div></div>
            }
            {
                props.state.hasError
                    ?
                        <div className="error-container">{props.state.errorMessage}</div>
                    :
                        <div></div>
            }
            {
                props.state.didFlightSearch
                    ?
                        <FlightList state={props.state}/>                
                    :
                        <div></div>
            }
            
        </div>
    );
};

export default FlightSearch;