import React, { Component } from 'react';
import axios from 'axios';

import { KButton, KTextInput, KToolbar, KToolbarItem, KWaitSpinner } from '@knossys/knossys-ui-core';

import DataTools from './utils/DataTools';
import KMessage from './KMessage';

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

    this.dataTools=new DataTools ();

    this.state={
      selectedFile: null, // Initially, no file is selected
      fileQueue: []
    };

    this.onFileChange=this.onFileChange.bind(this);
    this.onFileClear=this.onFileClear.bind(this);
    this.onFileUpload=this.onFileUpload.bind(this);    
  }

  /**
   *
   */
  componentDidUpdate(prevProps) {
    console.log ("componentDidUpdate ()");

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
    const formData = new FormData();     
    formData.append(
      "kfiledata",
      this.state.selectedFile,
      this.state.selectedFile.name
    );
     
    console.log(this.state.selectedFile);
     
    axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
    axios.post(this.props.backend+"api/v1/upload", formData);
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
    return (
      <div className="kdataupload-queue">
       <ul>
       </ul>
      </div>
    );
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
        <div>
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
