import React, { Component } from 'react';
import axios from 'axios';

import { KButton, KTextInput, KToolbar, KToolbarItem, KWaitSpinner } from '@knossys/knossys-ui-core';
import { KDataTools, KMessage, KServerFileTools } from '@knossys/knossys-data-portal';

import KDataBasicTable from './KDataBasicTable';

import './css/dataupload.css';

/**
 *
 */
class KDataUpload extends Component {

  /**
   * @param {any} props
   */  
  constructor (props){
    super (props);

    this.updateTimerId=-1;
    this.dataTools=new KDataTools ();
    this.serverFileTools=new KServerFileTools ();

    this.state={
      selectedFile: null, // Initially, no file is selected
      fileQueue: []
    };

    this.onFileChange=this.onFileChange.bind(this);
    this.onFileClear=this.onFileClear.bind(this);
    this.onFileUpload=this.onFileUpload.bind(this);    
    this.onFileQueueUpdate=this.onFileQueueUpdate.bind(this);
  }

  /**
   *
   */
  componentDidMount () {
    console.log ("componentDidMount ()");

    this.updateTimerId=setInterval (this.onFileQueueUpdate,5000);
    this.onFileQueueUpdate ();
  }

  /**
   *
   */
  componentWillUnmount () {
    console.log ("componentWillUnmount ()");
    clearInterval(this.updateTimerId);
  }

  /**
   *
   */
  componentDidUpdate(prevProps) {
    //console.log ("componentDidUpdate ()");

    // Reset all the things!
    /*
    if (this.props.trigger !== prevProps.trigger) {
      this.setState ({
        table: this.state.source.data,
        headers: this.setFormatting (this.dataTools.deepCopy (this.state.source.data.headers)),
        status: "Loaded " + this.state.source.data.content.length + " rows"
      });
    }
    */
  }

  /**
   * 
   */
  onFileQueueUpdate () {
    //console.log ("onFileQueueUpdate ("+this.props.backend+"/api/v1/getuploadqueue)");

    if (this.props.datasource) {
      this.props.datasource.apiCall ("getuploadqueue").then ((aMessage) => {      
        //console.log (aMessage.data);
        this.setState ({
          fileQueue: aMessage.data
        });
      });    
    } else {
      console.log ("No datasource available");
    }
  }

  /**
   * On file select (from the pop up)
   */
  onFileChange (event) {
    console.log ("onFileChange ()");
    this.setState({ selectedFile: event.target.files[0] });       
  };

  /**
   * On file select (from the pop up)
   */
  onFileClear (event) {
    //console.log ("onFileChange ()");
    this.setState({ selectedFile: null });
  };  
     
  /**
   * On file upload (click the upload button)
   */
  onFileUpload () {     
    console.log("onFileUpload()");

    let that=this;

    const formData = new FormData();     
    formData.append(
      "kfiledata",
      this.state.selectedFile,
      this.state.selectedFile.name
    );
     
    //console.log(this.state.selectedFile);
     
    axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
    axios.post(this.props.backend+"/api/v1/upload", formData)
    .then(function (response) {
      console.log("upload response:");
      console.log(response.data);
      that.onFileClear ();
      that.onFileQueueUpdate ();
    })
    .catch(function (error) {
      console.log("upload error:");
      console.log(error);
      that.onFileClear ();
    });
  }

  /**
   * 
   */
  fileData () {     
    if (this.state.selectedFile) {          
      return (
        <div className="kdataupload-info">
          <p><b>File Details</b></p>
          <p>File Name: {this.state.selectedFile.name}</p>
          <p>File Type: {this.state.selectedFile.type}</p>
          <p>Last Modified: {this.state.selectedFile.lastModifiedDate.toDateString()}</p>
        </div>
      );
    } else {
      return (
        <div className="kdataupload-info">
          <p><b>File Details</b></p>
          <p>File Name: ---</p>
          <p>File Type: ---</p>
          <p>Last Modified: ---</p>
        </div>
      );
    }
  }

  /**
   * 
   */
  fileQueue () {
    let queue=[];

    for (let i=0;i<this.state.fileQueue.length;i++) {
      let aFile=this.state.fileQueue [i];
      queue.push([
        aFile.name,
        this.serverFileTools.stateToString (aFile.state),
        "Unassigned"
      ]);
    }

    return (<KDataBasicTable headers={["Name","State","Pipeline"]} data={queue}/>);
  }

  /**
   * 
   */  
  render() {
    let uploadButton;
    let clearButton;

    if (this.state.selectedFile) {
      uploadButton=<KButton size={KButton.REGULAR} onClick={this.onFileUpload}>Upload</KButton>;
    }

    if (this.state.selectedFile) {
      clearButton=<KButton size={KButton.REGULAR} onClick={this.onFileClear}>Clear</KButton>
    }    

    return (
      <div className="kdataupload" style={this.props.styles}>
        <div className="kdataupload-buttonbar">
          <input id="kfileupload" type="file" onChange={this.onFileChange} />
          <label htmlFor="kfileupload" className="kfileupload">Select file</label>
          {uploadButton}
          {clearButton}
        </div>
        {this.fileData()}
        {this.fileQueue()}
      </div>
    );
  }
}

export default KDataUpload;
