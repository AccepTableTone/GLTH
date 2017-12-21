//react
import React from 'react';
//libraries
import FontAwesome from 'react-fontawesome';

export default () => {    
    return (
        <div className="loader-container">
            <FontAwesome name='plane' className="plane-icon fa-spin"/>
        </div>        
    );    
};
