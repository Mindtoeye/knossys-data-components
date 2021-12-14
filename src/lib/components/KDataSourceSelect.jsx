import React, { Component } from 'react';

import DataTools from './utils/DataTools';
import KMessage from './KMessage';

import './css/tableselect.css';

/**
 * 
 */
class KDataSourceSelect extends Component {

  /**
   * 
   */
  constructor (props) {
    super(props);

    this.state={

    };
  }

  /**
   * 
   */
  componentDidMount () {
    console.log ("componentDidMount ()");

    if (this.props.source) {
      this.props.source.getTables();
    }
  }  

  /**
   *
   */
  componentDidUpdate(prevProps) {
    console.log ("componentDidUpdate ()");

    
  }  

  /**
   * 
   */
  generateTableTree () {
    console.log ("generateTableTree ()");

    let items=[];



    return (items);
  }

  /**
   * 
   */
  render () {
    let tabletree;

    this.generateTableTree ();

    return (<div className="ktable-select">
      <div className="ktable-tree">
      {tabletree}
      </div>
      <div className="ktable-info">
      </div>
    </div>);
  }
}

export default KDataSourceSelect;
