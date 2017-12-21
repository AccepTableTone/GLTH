//react
import React, {Component} from 'react';
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
            isError:false
        }

        this.onOptionSelect = this.onOptionSelect.bind(this);
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
        this.setState({searchTerm: nextProps.acText, airports:[]})
    }

    //build drop down of airport options
    buildAutocompleteOptions = () => {
        return this.state.airports.map((item, idx) => {
            let opt = `${item}`
            return (
                <div onClick={() => this.onOptionSelect(item)} key={idx}>
                    <div className="name-text">{item.City}, {item.Country}</div>
                    <div className="sub-text">({item.IATA}-{item.Name})</div>
                </div>
            )
        });
    }

    //select text box text on focus
    handleFocus = (event) => {event.target.select();}
    handleBlur = (event) => {
        this.setState({airports:[], searchTerm:''})
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
                    <div><input type="text" className="search-input" maxLength="75" autoComplete="off" onChange={this.onInputChange} onFocus={this.handleFocus} value={this.state.searchTerm}  /></div>
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
                                <div className="ac-result-container">{this.buildAutocompleteOptions()}</div>
                            :
                                <div></div>
                    }                 
                    
                </div>
                
            </div>
        );
    }
}

export default AirportAutocomplete; 