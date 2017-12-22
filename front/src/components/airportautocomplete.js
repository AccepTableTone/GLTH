//react
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
//libraries
import FontAwesome from 'react-fontawesome';
//project
import * as CONSTS from '../config/constants';


class AirportAutocomplete extends Component {

    constructor(props) {
        super(props);

        this.state = {
            airports:[],
            searchTerm:'',
            isSearching:false,
            isError:false,
            listCursor:-1,
            heightMarker: [],
            heightMarkerAction:1
        }

        this.handleKeyNavigation = this.handleKeyNavigation.bind(this);
    }

    //track characters entered by user
    onInputChange = (event) => {
        this.setState({searchTerm:event.target.value});
        if(event.target.value.length > 2)
            this.searchForAirports(event.target.value);
    };

    //when option is selected call prop function passed in by parent
    onOptionSelect = (airport) => {
        this.props.onAirportSelect(airport);        
    }

    //we pass the selected airport in from the parent after we tell them about it
    //this way the parent can blank out the text fields after a search is complete
    componentWillReceiveProps(nextProps){
        this.setState({searchTerm: nextProps.acText, airports:[], heightMarker:[], heightMarkerAction:1})
    }

    //highlight the search term in each autocomplete option
    highlightSearchTerm(text) {
        // Split on higlight term and include term into parts, ignore case
        let parts = text.split(new RegExp(`(${this.state.searchTerm})`, 'gi'));
        return (<span> { parts.map((part, i) => <span key={i} className={part.toLowerCase() === this.state.searchTerm.toLowerCase() ? 'st-text' : '' }>{ part }</span>)} </span>);            
    }

    //build drop down of airport options
    buildAutocompleteOptions = () => {
        return this.state.airports.map((item, idx) => {
            return (
                <div onClick={() => this.onOptionSelect(item)} key={idx} ref={`${this.state.listCursor === idx ? 'focusedDiv' : ''}`} className={`${this.state.listCursor === idx ? 'ac-result-focused-div' : ''}`}>
                    <div className="name-text">{this.highlightSearchTerm(`${item.City}, ${item.Country}`)}</div>
                    <div className="sub-text">{this.highlightSearchTerm(`${item.IATA}-${item.Name}`)}</div>
                </div>
            )
        });
    }

    componentDidUpdate() {
        if(this.state.listCursor > -1 && this.state.listCursor < this.state.airports.length){
            //get div container holding airport divs
            let airportOptsContainer = ReactDOM.findDOMNode(this.refs.autocompletOptionsContainer);
            //get highlighted div height, determine which way we are going
            let highlightedHeight = ReactDOM.findDOMNode(this.refs.focusedDiv).clientHeight;
            let isMovingUp = this.state.heightMarkerAction < 0;            
            //track height from top
            if(isMovingUp)
                this.state.heightMarker.pop();
            else
                this.state.heightMarker.push(highlightedHeight);
            //we may have to scroll
            let distanceFromTop = this.state.heightMarker.reduce((a, b) => a + b, 0);
            if(distanceFromTop > 220 || (distanceFromTop < 200 && isMovingUp))
                airportOptsContainer.scrollTop = (this.state.heightMarker.reduce((a, b) => a + b, 0)) - highlightedHeight;
        }
    }

    //select text box text on focus
    handleFocus = (event) => {event.target.select();}
    handleBlur = (event) => {this.setState({airports:[], searchTerm:''})}
    handleKeyNavigation = (event) => {
        //down arrow - moving away from text box 
        //if user steps down the list then back up into the text box, then down the list again - we need to blank out the heightMarker array because the height of the first option is still in the array  o--(..\)o     
        if (event.keyCode === 40 && this.state.listCursor < this.state.airports.length-1)
            this.setState({listCursor: this.state.listCursor + 1, heightMarkerAction:1, heightMarker: (this.state.listCursor === -1 ? [] : this.state.heightMarker)});
        //up arrow - moving closer to text box
        else if(event.keyCode === 38 && this.state.listCursor > -1)
            this.setState({listCursor: this.state.listCursor - 1, heightMarkerAction:-1});
        //the user hits enter and selects an airport
        else if(event.keyCode === 13)
            if(this.state.listCursor > -1)
                ReactDOM.findDOMNode(this.refs.focusedDiv).click();                   
    }

    //get list of airports
    searchForAirports = (searchTerm) => {
        this.setState({isSearching:true});
        fetch(`${CONSTS.apiBaseUrl}/airports/${searchTerm}`)
        .then((response) => {
            if (!response.ok) {
                this.setState({isError:true, airports:[], isSearching:false});
            }
            return response;
        })
        .then(response => response.json())
        .then(response =>  {
            this.setState({isSearching:false, airports:response,});
        })
        .then(() => {
            this.buildAutocompleteOptions();
        })
        .catch(error => {
            this.setState({isError:true, airports:[]});
            this.setState({isSearching:false});
        });
    }

    render(){
        return (
            <div>
                {
                    this.state.isError
                        ? 
                            <div className="error-text">Sorry, there was an unexpected error.<br/>>Please refresh the page.</div>
                        :
                            <div></div>
                }
                <div className="ac-input-container">
                    <div><input type="text" className="search-input" maxLength="75" autoComplete="off" onChange={this.onInputChange} onFocus={this.handleFocus} value={this.state.searchTerm} onKeyDown={ this.handleKeyNavigation } /></div>
                    {
                        this.state.isSearching
                            ?
                                <div className="ac-loader"><FontAwesome name='plane' className="plane-ac-icon fa-spin"/></div>
                            :
                                <div></div>
                    }   
                    {
                        this.state.airports.length > 0
                            ?
                                <div className="ac-result-container" ref="autocompletOptionsContainer">{this.buildAutocompleteOptions()}</div>
                            :
                                <div></div>
                    }                 
                    
                </div>
                
            </div>
        );
    }
}

export default AirportAutocomplete; 