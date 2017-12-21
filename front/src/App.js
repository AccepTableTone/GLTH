//react
import React, { Component } from 'react';
//libraries
import {connect} from 'react-redux';
//project
import FlightSearch from './components/flightsearch';
import './styles/site.css';

import {getFlights} from './redux/actions/actions';

class App extends Component {
  
    render() {
      return (
            <div className="app-container">
                <FlightSearch state={this.props.state} searchFlights={(orig, dest) => {this.props.searchForFlights(orig, dest)}} />
            </div>
        );        
    }
}

function mapStateToProps(state){
  return{
    state:state.flights
  };
}

const mapDispatchToProps = (dispatch) => {
  return{
    searchForFlights: (origin, destination) => dispatch(getFlights(origin, destination))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
