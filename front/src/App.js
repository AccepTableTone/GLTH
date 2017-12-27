//react
import React, { Component } from 'react';
//libraries
import {connect} from 'react-redux';
//project
import FlightSearch from './components/flightsearch';
import PopularFlights from './components/popularflights';

import './styles/site.css';

import {getFlights, getPopularFlights} from './redux/actions/actions';

class App extends Component {
  
    componentDidMount = () => {
        this.props.getPopularFlights();
    }

    render() {
      return (
            <div className="app-container">
                <FlightSearch state={this.props.state} searchFlights={(orig, dest) => {this.props.searchForFlights(orig, dest)}} />
                <PopularFlights popularFlights={this.props.state.popularFlights} searchFlights={(orig, dest) => {this.props.searchForFlights(orig, dest)}}></PopularFlights>
            </div>
        );        
    }
}

const mapStateToProps = (state) => {
  return{
    state:state.flights
  };
}

const mapDispatchToProps = (dispatch) => {
  return{
    searchForFlights: (origin, destination) => dispatch(getFlights(origin, destination)),
    getPopularFlights: () => dispatch(getPopularFlights())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
