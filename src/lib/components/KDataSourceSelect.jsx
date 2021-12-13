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

  render () {
    return (<div className="ktable-select">
      <div className="ktable-tree">
      </div>
      <div className="ktable-info">
      </div>
    </div>);
  }
}

export default KDataSourceSelect;
