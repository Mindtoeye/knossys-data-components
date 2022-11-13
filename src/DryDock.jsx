import React, { Component } from 'react';

import { KnossysInfoPanel, KButton, KTextInput } from '@knossys/knossys-ui-core';
import { WindowManager, ApplicationManager } from '@knossys/knossys-window-manager';

import DataTools from './lib/components/utils/DataTools';
import TableTools from './lib/components/utils/TableTools';
import KDataUpload from './lib/components/KDataUpload';
import KDataTable from './lib/components/KDataTable';
import KDataSource from './lib/components/KDataSource';
import KDataSourceDummy from './lib/components/KDataSourceDummy';
import KDataSourceSelect from './lib/components/KDataSourceSelect';

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

    this.appManager=new ApplicationManager ();

    this.state={
      backend: "http://192.168.0.108:8055",
      trigger: 0,
      wrapText: "false",
      maxsize: 1000,
      maxcols: 10,
      showIndex: "false",
      globalSettings: {}
    }

    this.dataTools=new DataTools ();
    this.tableTools=new TableTools ();
    //this.dataSource=new KDataSourceDummy ();
    this.dataSource=new KDataSource ();
    this.dataSource.setBackend (this.state.backend);

    this.selectTable=this.selectTable.bind(this);
    this.getData=this.getData.bind(this);
    this.wrapText=this.wrapText.bind(this);
    this.showIndex=this.showIndex.bind(this);
    this.handleChangePageSize=this.handleChangePageSize.bind(this);
    this.handleChangeMaxSize=this.handleChangeMaxSize.bind(this);
    this.handleChangeMaxCols=this.handleChangeMaxCols.bind(this);
    this.handleChangeURL=this.handleChangeURL.bind(this);    

    this.getTableContent=this.getTableContent.bind(this);
    this.getTableSelectContent=this.getTableSelectContent.bind(this);
    this.getUploadContent=this.getUploadContent.bind(this);
  }

  /**
   * 
   */
  componentDidMount () {
    console.log ("componentDidMount ()");

    this.dataSource.setBackend (this.state.backend);

    this.appManager.addApplication ({
      title: "Knossys Data Table",
      type: "window",
      width: 929,
      height: 662,
      content: this.getTableContent
    });

    this.appManager.addApplication ({
      title: "Knossys Data Upload",
      type: "window",
      width: 250,
      height: 300,
      content: this.getUploadContent
    });

    this.updateWindowStack ();    
  }

  /**
   * This will go into the app manager
   */
  updateWindowStack () {
    this.setState(this.state);
  }   

  /**
   *
   */
  getTableContent () {
    return (<KDataTable 
        headeruppercase="true" 
        shownavigation="true"      
        source={this.dataSource}
        trigger={this.state.trigger}
        wraptext={this.state.wrapText}
        showindex={this.state.showIndex}>
      </KDataTable>);
  }   

  /**
   *
   */
  getTableSelectContent () {
    return (<KDataSourceSelect  
      source={this.dataSource}
      trigger={this.state.trigger}>          
      </KDataSourceSelect>);
  }

  /**
   *
   */
  getUploadContent () {
    return (<KDataUpload datasource={this.dataSource} backend={this.state.backend}></KDataUpload>);
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

    this.dataSource.backend=this.state.backend;
    this.dataSource.setMaxRows (this.state.maxsize);
    this.dataSource.setMaxCols (this.state.maxcols);
    this.dataSource.getData ().then ((aMessage) => {      
      console.log ("Got data");

      // Modify internal state from message
      this.dataSource.stateFromMessage (aMessage);

      // then trigger visual changes
      this.setState ({
        trigger: this.state.trigger+1
      });

      this.updateWindowStack ();
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
  handleChangeURL (aValue) {
    this.dataSource.setBackend (aValue);
    this.setState({
      backend: aValue
    });
  }

  /**
   *
   */
  render() {
    console.log ("render()");
    
    return (<WindowManager
        trigger={this.state.trigger}
        classes="knossys-dark"
        settings={this.state.globalSettings}
        appManager={this.appManager}>
        <KButton onClick={this.selectTable} style={{marginLeft: "2px"}}>Select</KButton>
        <KButton onClick={this.wrapText} style={{marginLeft: "2px"}}>{"Wrap text: " + this.state.wrapText}</KButton>
        <KButton onClick={this.showIndex} style={{marginLeft: "2px"}}>{"Show index: " + this.state.showIndex}</KButton>
        <div className="drydock-divider"></div>
        <KButton onClick={this.getData} style={{marginLeft: "2px"}}>Generate</KButton>
        <div className="drydock-label">Page Size:</div>
        <KTextInput type={KTextInput.TYPE_ALPHANUMERIC} size={KTextInput.REGULAR} style={{width: "50px"}} value={this.dataSource.getPageSize()} handleChange={this.handleChangePageSize}></KTextInput>
        <div className="drydock-label">Max Nr Rows:</div>
        <KTextInput type={KTextInput.TYPE_ALPHANUMERIC} size={KTextInput.REGULAR} style={{width: "50px"}} value={this.state.maxsize} handleChange={this.handleChangeMaxSize}></KTextInput>
        <div className="drydock-label">Max Nr Colums:</div>
        <KTextInput type={KTextInput.TYPE_ALPHANUMERIC} size={KTextInput.REGULAR} style={{width: "50px"}} value={this.state.maxcols} handleChange={this.handleChangeMaxCols}></KTextInput>
        <div className="drydock-label">Backend URL:</div>
        <KTextInput size={KTextInput.REGULAR} style={{width: "360px"}} value={this.state.backend} handleChange={this.handleChangeURL}></KTextInput>
      </WindowManager> 
    );
  }
}

export default DryDock;


