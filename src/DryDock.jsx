import React, { Component } from 'react';

import { KnossysInfoPanel, KButton, KTextInput } from '@knossys/knossys-ui-core';

import DataTools from './lib/components/utils/DataTools';
import TableTools from './lib/components/utils/TableTools';
import KDataTable from './lib/components/KDataTable';
import KDataSource from './lib/components/KDataSource';

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
    this.dataSource=new KDataSource ();

    this.state={
      trigger: 0,
      wrapText: "false",
      maxsize: 1000,
      maxcols: 10,
      showIndex: "false"
    }

    this.generateData=this.generateData.bind(this);
    this.wrapText=this.wrapText.bind(this);
    this.showIndex=this.showIndex.bind(this);
    this.handleChangePageSize=this.handleChangePageSize.bind(this);
    this.handleChangeMaxSize=this.handleChangeMaxSize.bind(this);
    this.handleChangeMaxCols=this.handleChangeMaxCols.bind(this);
  }

  /**
   *
   */
  generateData () {
    console.log ("generateData ()");

    let updated=this.state.trigger;
    updated++;

    this.dataSource.setMaxRows (this.state.maxsize);
    this.dataSource.setMaxCols (this.state.maxcols);
    this.dataSource.generateData ();

    this.setState ({
      trigger: updated
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
  showIndex () {
    console.log ("showIndex ()");

    if (this.state.showIndex=="true") {
      this.setState ({
        showIndex: "false"
      });
    } else {
      this.setState ({
        showIndex: "true"
      });
    }
  }  

  /**
   *
   */
  handleChangePageSize (aValue) {
    let intValue=parseInt(aValue);
    if (intValue>100) {
      intValue=100;
    }

    this.dataSource.setPageSize (intValue);
  }

  /**
   *
   */
  handleChangeMaxSize (aValue) {
    let intValue=parseInt(aValue);
    if (intValue>1000) {
      intValue=1000;
    }    
    this.setState({
      maxsize: intValue
    });
  }

  /**
   *
   */
  handleChangeMaxCols (aValue) {
    let intValue=parseInt(aValue);
    if (intValue>25) {
      intValue=25;
    }
    this.setState({
      maxcols: intValue
    });
  }

  /**
   *
   */
  render() {
    return (
      <div tabIndex="0" className="fauxdesktop knossys-dark" onKeyDown={this.onKeyDown}>
        <KButton onClick={this.wrapText} style={{marginLeft: "2px"}}>{"Wrap text: " + this.state.wrapText}</KButton>
        <KButton onClick={this.showIndex} style={{marginLeft: "2px"}}>{"Show index: " + this.state.showIndex}</KButton>
        <div className="drydock-divider"></div>
        <KButton onClick={this.generateData} style={{marginLeft: "2px"}}>Generate</KButton>
        <div className="drydock-label">Page Size:</div>
        <KTextInput type={KTextInput.TYPE_ALPHANUMERIC} size={KTextInput.REGULAR} style={{width: "50px"}} value={this.dataSource.getPageSize()} handleChange={this.handleChangePageSize}></KTextInput>
        <div className="drydock-label">Max Nr Rows:</div>
        <KTextInput type={KTextInput.TYPE_ALPHANUMERIC} size={KTextInput.REGULAR} style={{width: "50px"}} value={this.state.maxsize} handleChange={this.handleChangeMaxSize}></KTextInput>
        <div className="drydock-label">Max Nr Colums:</div>
        <KTextInput type={KTextInput.TYPE_ALPHANUMERIC} size={KTextInput.REGULAR} style={{width: "50px"}} value={this.state.maxcols} handleChange={this.handleChangeMaxCols}></KTextInput>        
        <KDataTable 
          source={this.dataSource}
          trigger={this.state.trigger}
          headeruppercase="true" 
          shownavigation="true"
          wraptext={this.state.wrapText}
          showindex={this.state.showIndex}
          styles={{margin: "5px 20px 20px"}}></KDataTable>
      </div>
    );
  }
}

export default DryDock;
