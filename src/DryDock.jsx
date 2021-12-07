import React, { Component } from 'react';

import { KnossysInfoPanel, KButton } from '@knossys/knossys-ui-core';

import DataTools from './lib/components/utils/DataTools';
import TableTools from './lib/components/utils/TableTools';
import KDataTable from './lib/components/KDataTable';

import '../css/main.css';
import '../css/drydock.css';

/**
 * 
 */
class DryDock extends Component {

  /**
   *
   */
  constructor(props) {
    super(props);

    this.dataTools=new DataTools ();
    this.tableTools=new TableTools ();

    this.state={
      data: this.tableTools.getEmptyTable(),
      wrapText: "true"
    }

    this.generateData=this.generateData.bind(this);
    this.wrapText=this.wrapText.bind(this);
  }

  /**
   *
   */
  componentDidMount () {
    this.generateData ();
  }

  /**
   *
   */
  generateData () {
    console.log ("generateData ()");

    let generated=this.tableTools.generateTableData ();

    this.setState ({
      data: generated
    });
  }

  /**
   *
   */
  wrapText () {
    console.log ("wrapText ()");

    if (this.state.wrapText=="true") {
      this.setState ({wrapText: "false"});
    } else {
      this.setState ({wrapText: "true"});
    }
  }

  /**
   *
   */
  render() {
    return (
      <div tabIndex="0" className="fauxdesktop knossys-dark" onKeyDown={this.onKeyDown}>
        <KButton onClick={this.generateData} style={{marginLeft: "20px"}}>Generate</KButton>
        <KButton onClick={this.wrapText}>{"Wrap text: " + this.state.wrapText}</KButton>
        <KDataTable 
          headeruppercase="true" 
          shownavigation="true"
          wraptext={this.state.wrapText}
          data={this.state.data}
          styles={{margin: "5px 20px 20px"}}></KDataTable>
      </div>
    );
  }
}

export default DryDock;
