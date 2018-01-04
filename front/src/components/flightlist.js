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
            let imgSrc = "";
            //logo should be in db
            const checkForLogo = (code) => {                
                switch(code){
                    case "CA":
                        imgSrc =  "https://upload.wikimedia.org/wikipedia/en/thumb/9/97/Air_China_Logo.svg/250px-Air_China_Logo.svg.png";
                        break;
                    case "CZ":
                        imgSrc = "https://upload.wikimedia.org/wikipedia/en/4/4c/China_Southern_Airlines_logo.png";
                        break;
                    case "WN":
                        imgSrc = "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Southwest_Airlines_logo_2014.svg/300px-Southwest_Airlines_logo_2014.svg.png";
                        break;
                    case "TK":
                        imgSrc = "https://upload.wikimedia.org/wikipedia/en/thumb/e/ef/Turkish_Airlines_logo.svg/300px-Turkish_Airlines_logo.svg.png";
                        break;
                    case "UA":
                        imgSrc = "https://upload.wikimedia.org/wikipedia/en/thumb/e/e0/United_Airlines_Logo.svg/300px-United_Airlines_Logo.svg.png";
                        break;
                    case "WS":
                        imgSrc = "https://upload.wikimedia.org/wikipedia/en/thumb/d/de/WestJet_logo_2016.svg/300px-WestJet_logo_2016.svg.png";
                        break;
                    case "AC":
                        imgSrc = "https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Air_Canada_Logo.svg/300px-Air_Canada_Logo.svg.png";
                        break;
                    default:
                        imgSrc = "";
                }
            }

            //do we have the logo of this airline
            checkForLogo(airline.Code);
            //if not logo - just show airline name
            return (
                imgSrc === ""
                    ?
                        <div className="name-text">{airline.Name} ({airline.Code})</div>
                    :
                        <div className="name-text"><img src={imgSrc} alt={`${airline.Name} logo`}/></div>
            );
        }

        const buildFlights = () => {
            //props.flights is an array of route arrays 
            //each route array is a 'trip'
            return props.flights.map((trips, tripIdx) => {
                    return (
                        <div className="flight-container" key={`trip${tripIdx}`}>
                        {
                            trips.Routes.map((route, routeIdx) => {
                                let airline = findAirline(route.Airline);
                                let origAirport = findAirport(route.Origin);
                                let destAirport = findAirport(route.Destination);
        
                                return (
                                    <div key={`trip${tripIdx}${routeIdx}`}>
                                        {
                                            trips.Routes.length > 1
                                                ?
                                                    <div className="flight-num-container">FLIGHT {routeIdx+ 1}  <span className="distance-container">Distance: {parseInt(route.Distance, 10)}km</span></div>
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
                        <span className="total-distance-container">Total Distance: {parseInt(trips.TotalDistance, 10)}km</span>
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