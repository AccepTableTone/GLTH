//react
import React from 'react';
//libraries
import _ from 'lodash';
//project
import * as CONSTS from '../config/constants';


const PopularFlights = (props) => {
    return (
        <div className="footer-container">
            {
                props.popularFlights.length > 0
                    ?
                        <div className="popular-flights-container">                            
                            <h4>Popular Flights</h4>
                            {buildPopularFlights(props.popularFlights, props.searchFlights)}
                            <div className="clr"></div>
                        </div>
                    :
                        <div></div>
            }        
        </div>
    );
};

const buildPopularFlights = (flights, searchFunc) => {

    const originAirports = _.filter(flights, function(obj){return obj.AirportType === CONSTS.IS_ORIGIN_AIRPORT});
    const destinationAirports = _.filter(flights, function(obj){return obj.AirportType === CONSTS.IS_DESTINATION_AIRPORT});
    let uniqueDestinations = [];

    return originAirports.map((origin, originIdx) => {
        uniqueDestinations = _.filter(destinationAirports, function(obj){return obj.IATA !== origin.IATA;});
        return(
            <div key={`k${origin.IATA}`} className="popular-flights-column">
                {
                    uniqueDestinations.map((destination, destinationIdx) => {                        
                        return (
                            <div onClick={() => {window.scroll(0,0);searchFunc(origin, destination);}} key={`k${origin.IATA}${destination.IATA}`}>
                                {`${origin.City} to ${destination.City}`}
                            </div>
                        );
                    })
                }
            </div>
        );
    });




};

export default PopularFlights;