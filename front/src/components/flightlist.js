//react
import React from 'react';
//libraries
import _ from 'lodash';
//project

const FlightList = (props) => {
    return(
        <div>
            {buildFlightList(props.state)}
        </div>
    );
};

const buildFlightList = (props) =>{
    let airlineList = props.airlines;
    let aiportList = props.airports;

    if(props.flights.length >0){

        //######################
        const findAirport = (iata) => {
            return _.find(aiportList, function(obj){return obj.IATA === iata});
        }
        const findAirline = (ac) => {
            return _.find(airlineList, function(obj){return obj.Code === ac});
        }
        //######################
        const buildAirportDiv = (airport) => {
            return (
                <div>
                    <div className="name-text">{airport.Name} ({airport.IATA})</div>
                    <div className="sub-text">{airport.City} - {airport.Country}</div>
                </div>
            );
        }
        const buildAirlineDiv = (airline) => {
            return (
                <div className="name-text">{airline.Name} ({airline.Code})</div>
            );
        }

        const buildFlights = () => {
            //props.flights is an array of route arrays 
            //each route array is a 'trip'
            return props.flights.map((trips, tripIdx) => {
                    return (
                        <div className="flight-container" key={`trip${tripIdx}`}>
                        {
                            trips.map((route, routeIdx) => {
                                let airline = findAirline(route.Airline);
                                let origAirport = findAirport(route.Origin);
                                let destAirport = findAirport(route.Destination);
        
                                return (
                                    <div key={`trip${tripIdx}${routeIdx}`}>
                                        {
                                            trips.length > 1
                                                ?
                                                    <div className="flight-num-container">FLIGHT {routeIdx+ 1}</div>
                                                :
                                                    <div></div>
                                        }
                                        <div className="flight-result">
                                            <div className="origin-container">{buildAirportDiv(origAirport)}</div>
                                            <div className="destination-container">{buildAirportDiv(destAirport)}</div>
                                            <div className="airline-container">{buildAirlineDiv(airline)}</div>
                                            <div className="clr"></div>
                                        </div>
                                    </div>
                                );
                            })
                        }
                        </div>    
                    )
                });
            };
        //######################

        return (
            <div className="bg-grey padb-40">
                <h3>{`Flights from ${props.origin.City}, ${props.origin.Country} to ${props.destination.City}, ${props.destination.Country}`}</h3>
                {buildFlights()}
            </div>            
        );
    }else if(props.hasError === false){
        return (
            <div className="bg-grey padb-40">
                <h3>{`Flights from ${props.origin.City}, ${props.origin.Country} to ${props.destination.City}, ${props.destination.Country}`}</h3>
                <div className="no-flight-text flight-container">
                    Sorry, we could not find any available flights o-[..\]-o
                </div>
            </div>            
        );
    }
}

export default FlightList;