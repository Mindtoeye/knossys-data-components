import React, { Component } from 'react';

import { KRadioList } from '@knossys/knossys-ui-core';
import { KDataTools, KTableTools, KMessage } from '@knossys/knossys-data-portal';

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
      tables:[]
    };

    this.radiolistChecked=this.radiolistChecked.bind(this);    
  }

  /**
   * 
   */
  componentDidMount () {
    console.log ("componentDidMount ()");

    if (this.props.source) {
      this.props.source.getTables().then ((aMessage) => {      
        console.log ("Got table data");

        // Modify internal state from message
        //this.dataSource.stateFromMessage (aMessage);
        this.setState ({
          tables: aMessage.data
        });
      });
    }
  }  

  /**
   *
   */
  radiolistChecked (aList) {
    console.log ("radiolistChecked ()");
    //console.log (JSON.stringify (aList, null, 2));

  }

  /**
   * 
   */
  generateTableTree () {
    console.log ("generateTableTree ()");

    let items=[];

    for (let i=0;i<this.state.tables.length;i++) {
       items.push ({
         name: this.state.tables[i],
         checked: false
       });
    }

    return (items);
  }

  /**
   * 
   */
  render () {
    let tabletree;

    tabletree=<KRadioList list={this.generateTableTree ()} radiolistChecked={(list) => this.radiolistChecked (list)} />

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
