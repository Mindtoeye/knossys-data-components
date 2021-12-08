import React, { Component } from 'react';

import { KnossysInfoPanel, KButton, KTextInput } from '@knossys/knossys-ui-core';

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
      wrapText: "true",
      pagesize: 100,
      maxsize: 1000,
      maxcols: 25,
      showindex: "true"
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
  componentDidMount () {
    this.generateData ();
  }

  /**
   *
   */
  generateData () {
    console.log ("generateData ()");

    let generated=this.tableTools.generateTableData (this.state.maxsize,this.state.maxcols);

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
  showIndex () {
    console.log ("showIndex ()");

    if (this.state.showindex=="true") {
      this.setState ({showindex: "false"});
    } else {
      this.setState ({showindex: "true"});
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
    this.setState({
      pagesize: intValue
    });
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
        <KButton onClick={this.generateData} style={{marginLeft: "20px"}}>Generate</KButton>
        <KButton onClick={this.wrapText} style={{marginLeft: "2px"}}>{"Wrap text: " + this.state.wrapText}</KButton>
        <KButton onClick={this.showIndex} style={{marginLeft: "2px"}}>{"Show index: " + this.state.showindex}</KButton>
        <div className="drydock-label">Page Size:</div>
        <KTextInput type={KTextInput.TYPE_ALPHANUMERIC} size={KTextInput.REGULAR} style={{width: "50px"}} value={(this.state.pagesize)} handleChange={this.handleChangePageSize}></KTextInput>
        <div className="drydock-label">Max Nr Rows:</div>
        <KTextInput type={KTextInput.TYPE_ALPHANUMERIC} size={KTextInput.REGULAR} style={{width: "50px"}} value={(this.state.maxsize)} handleChange={this.handleChangeMaxSize}></KTextInput>
        <div className="drydock-label">Max Nr Colums:</div>
        <KTextInput type={KTextInput.TYPE_ALPHANUMERIC} size={KTextInput.REGULAR} style={{width: "50px"}} value={(this.state.maxcols)} handleChange={this.handleChangeMaxCols}></KTextInput>        
        <KDataTable 
          headeruppercase="true" 
          shownavigation="true"
          wraptext={this.state.wrapText}
          data={this.state.data}
          pagesize={this.state.pagesize}
          showindex={this.state.showindex}
          styles={{margin: "5px 20px 20px"}}></KDataTable>
      </div>
    );
  }
}

export default DryDock;
