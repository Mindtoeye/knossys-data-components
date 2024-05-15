import React, { Component } from 'react';
import axios from 'axios';

import { KButton, KTextInput, KToolbar, KToolbarItem, KWaitSpinner } from '@knossys/knossys-ui-core';
import { KDataTools, KMessage } from '@knossys/knossys-data-portal';

import './css/datagenerator.css';

/**
 *
 */
class KDataGenerator extends Component {

  /**
   * @param {any} props
   */  
  constructor (props){
    super (props);

    this.dataTools=new KDataTools ();

    this.state={
      wrapText: "false",
      maxsize: 1000,
      maxcols: 10,
      showIndex: "false",      
    };

    this.selectTable=this.selectTable.bind(this);
    this.getData=this.getData.bind(this);
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
    console.log ("componentDidMount ()");
  }

  /**
   *
   */
  componentWillUnmount () {
    console.log ("componentWillUnmount ()");
  }

  /**
   *
   */
  selectTable () {
    console.log ("selectTable ()");

    this.appManager.addApplication ({
      title: "Select a Table",
      type: "dialog",
      modal: false,
      centered: true,
      width: 320,
      height: 200,
      content: this.getTableSelectContent
    });    

    this.updateWindowStack ();   
  }

  /**
   *
   */
  getData () {
    console.log ("getData ()");

    this.props.source.setMaxRows (this.state.maxsize);
    this.props.source.setMaxCols (this.state.maxcols);
    this.props.source.getData ().then ((aMessage) => {      
      console.log ("Got data");

      // Modify internal state from message
      this.props.source.stateFromMessage (aMessage);
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

    this.props.source.setPageSize (intValue);
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
      <div className="kdataupload" style={this.props.styles}>
        <div className="kdataupload-buttonbar">
        </div>

        <KButton onClick={this.wrapText} style={{marginLeft: "2px"}}>{"Wrap text: " + this.state.wrapText}</KButton>
        <KButton onClick={this.showIndex} style={{marginLeft: "2px"}}>{"Show index: " + this.state.showIndex}</KButton>
        <div className="drydock-divider"></div>
        <KButton onClick={this.getData} style={{marginLeft: "2px"}}>Generate</KButton>
        <div className="drydock-label">Page Size:</div>
        <KTextInput type={KTextInput.TYPE_ALPHANUMERIC} size={KTextInput.REGULAR} style={{width: "50px"}} value={this.props.source.getPageSize()} handleChange={this.handleChangePageSize}></KTextInput>
        <div className="drydock-label">Max Nr Rows:</div>
        <KTextInput type={KTextInput.TYPE_ALPHANUMERIC} size={KTextInput.REGULAR} style={{width: "50px"}} value={this.state.maxsize} handleChange={this.handleChangeMaxSize}></KTextInput>
        <div className="drydock-label">Max Nr Colums:</div>
        <KTextInput type={KTextInput.TYPE_ALPHANUMERIC} size={KTextInput.REGULAR} style={{width: "50px"}} value={this.state.maxcols} handleChange={this.handleChangeMaxCols}></KTextInput>
      </div>
    );
  }
}

export default KDataGenerator;
