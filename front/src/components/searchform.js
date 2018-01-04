//react
import React, {Component} from 'react';
//project
import AirportAutocomplete from './airportautocomplete';
import Images from '../config/images';

class SearchForm extends Component{

    constructor(props){
        super(props);

        this.state = {
            origin:'',
            destination: '',
            originName:'',
            destinationName:''
        }
    }

    //these functions are passed down to the autocomplete text boxes 
    setOrigin = (origin) => {this.setState({origin, originName:`${origin.Name} (${origin.IATA})`});};
    setDestination = (destination) => {this.setState({destination, destinationName:`${destination.Name} (${destination.IATA})`});};
    searchFlights(){
        if(this.state.origin !== '' && this.state.destination !== ''){
            this.props.searchFlights(this.state.origin, this.state.destination);
            this.setState({origin:'', destination:'', originName:'',destinationName:''});
        }            
    }

    render(){
        return (
            <div className="bg-white">
                <div className="shortest-container"><img src={Images.shortest} alt="'shortest flight' search"/></div>
                <h1>Flight Search</h1>
                <div className="ac-container">
                    <label>Flying from</label>
                    <AirportAutocomplete onAirportSelect={(origin) => this.setOrigin(origin)} acText={this.state.originName}/>
                </div>
                <div className="ac-container">
                    <label>Flying to</label>
                    <AirportAutocomplete onAirportSelect={(destination) => this.setDestination(destination)} acText={this.state.destinationName}/>
                </div>
                {
                    this.state.origin !== '' && this.state.destination !== ''
                        ?
                            <div className="ac-button-container">
                                <input type="button" onClick={() => this.searchFlights()} value="search" className="search-button"/>
                            </div>
                        :
                            <div></div>
    
                }
                <div className="clr"></div>
             </div>
        );
    }
};

export default SearchForm;