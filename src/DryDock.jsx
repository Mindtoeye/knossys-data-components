import React, { Component } from 'react';

import { RiStackshareLine } from 'react-icons/ri';
import { VscFileSubmodule } from 'react-icons/vsc';
import { MdPermIdentity } from 'react-icons/md';
import { GiPortal } from 'react-icons/gi';
import { GrTable } from 'react-icons/gr';
import { ImTable2 } from 'react-icons/im';

import { KnossysInfoPanel, KButton, KTextInput } from '@knossys/knossys-ui-core';
import { WindowManager, ApplicationManager } from '@knossys/knossys-window-manager';
import { Desktop, DesktopIconManager } from '@knossys/knossys-virtual-desktop';
import { KDataTools, KTableTools, KDataSourceDummy } from '@knossys/knossys-data-portal';

import KDataUpload from './lib/components/KDataUpload';
import KDataGenerator from './lib/components/KDataGenerator';
import KDataTable from './lib/components/KDataTable';
import KDataSource from './lib/components/KDataSource';
//import KDataSourceDummy from './lib/components/KDataSourceDummy';
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

    this.faces=[<RiStackshareLine/>,<VscFileSubmodule/>, <MdPermIdentity />, <GiPortal />, <ImTable2 />];

    this.appManager=new ApplicationManager ();

    this.state={
      backend: "http://localhost:8055",
      trigger: 0,
      globalSettings: {}
    }

    this.dataTools=new KDataTools ();
    this.tableTools=new KTableTools ();

    //this.dataSource=new KDataSourceDummy ();
    this.processConnection=this.processConnection.bind(this);
    this.dataSource=new KDataSource ();
    this.dataSource.setBackend (this.state.backend);
    this.dataSource.setConnectionHandler (this.processConnection);

    this.getTableContent=this.getTableContent.bind(this);
    this.getTableSelectContent=this.getTableSelectContent.bind(this);
    this.getUploadContent=this.getUploadContent.bind(this);
    this.getGeneratorContent=this.getGeneratorContent.bind(this);

    // Desktop methods and tools

    this.update = this.update.bind(this);
    this.launch = this.launch.bind(this);

    this.desktopIconManager=new DesktopIconManager ();
    this.desktopIconManager.setUpdateDesktop(this.update);     
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

    this.appManager.addApplication ({
      title: "Knossys Data Generator",
      type: "window",
      width: 350,
      height: 200,
      content: this.getGeneratorContent
    });

    this.desktopIconManager.addApp ("Data Portal","dataportal","knossys:application",3);
    this.desktopIconManager.addApp ("Data Viewer","datatest","knossys:application",4);

    // we start with the icon hidden at first so that we can show it when the driver
    // connects
    let fManagerIcon=this.desktopIconManager.getIcon ("dataportal");
    if (fManagerIcon) {
      fManagerIcon.disabled=true;
      this.update ();
    }
  }

  /**
   * change this value to trigger a state update in the desktop. Haven't made a decision yet on
   * which system/library paradigm to use to accomplish this in a cleaner way
   */
  update () {
    let trgr=this.state.trigger;
    this.setState ({
      trigger: trgr++
    });
  }

  /**
   *
   */
  launch (anApp) {
    console.log ("launch ("+anApp+")");

  }  

  /**
   *
   */
  processConnection (aConnected) {
    console.log ("processConnection ("+aConnected+")");

    let fManagerIcon=this.desktopIconManager.getIcon ("dataportal");
    if (fManagerIcon) {
      fManagerIcon.disabled=!aConnected;
      this.update ();
    }
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
  getGeneratorContent () {
    return (<KDataGenerator  
      source={this.dataSource}
      trigger={this.state.trigger}>          
      </KDataGenerator>);
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
  render() {
    console.log ("render()");
    
    return (
      <Desktop 
        trigger={this.state.trigger} // change this value to trigger a state update in the desktop
        iconManager={this.desktopIconManager} 
        faces={this.faces} 
        snap={true} 
        launch={this.launch}>      
          <WindowManager
            trigger={this.state.trigger}
            classes="knossys-dark"
            settings={this.state.globalSettings}
            appManager={this.appManager}/>
        </Desktop>
    );
  }
}

export default DryDock;


