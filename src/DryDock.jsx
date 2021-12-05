import React, { Component } from 'react';

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
      data: this.tableTools.getEmptyTable()
    }
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

    console.log (generated);

    this.setState ({
      data: generated
    });
  }

  /**
   *
   */
  render() {
    return (
      <div tabIndex="0" className="fauxdesktop" onKeyDown={this.onKeyDown}>
        <KDataTable data={this.state.data}></KDataTable>
      </div>
    );
  }
}

export default DryDock;
