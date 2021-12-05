import React, { Component } from 'react';

import { BiChevronDown, BiChevronUp } from 'react-icons/bi';

import DataTools from './utils/DataTools';

import './css/datatable.css';

/**
 *
 */
class KDataTable extends Component {

  /**
   * @param {any} props
   */  
  constructor (props){
    super (props);

    this.dataTools=new DataTools ();

    this.state={
    };

    this.onHeaderClick=this.onHeaderClick.bind(this);
    this.onCellClick=this.onCellClick.bind(this);
  }

  /**
   * 
   */
  onHeaderClick (aCol) {
    console.log ("onHeaderClick ("+aCol+")");

  }

  /**
   * 
   */
  onCellClick (aRow,aCol) {
    console.log ("onCellClick ("+aRow+","+aCol+")");

  }

  /**
   * 
   */
  generateHeadings () {
    let headings=[];

    if (!this.props.data) {
      console.log ("Error: no data provided");
      return (headings);
    }

    if (this.props.data.headers.length==0) {
      console.log ("Error: no data provided");
      return (headings);
    }

    let calculatedWidth=(100/this.props.data.headers.length)+"%";

    for (let i=0;i<this.props.data.headers.length;i++) {
      let aHeader=this.props.data.headers [i];
      headings.push (<th width={calculatedWidth}>
        <div className="kheader-cell" onClick={(e) => this.onHeaderClick (i)}>
          <div className="kheader-label">{aHeader.name}</div>
          <div className="kheader-chevron"><BiChevronDown/></div>
        </div>
      </th>);
    }

    return (headings);
  }

  /**
   * 
   */
  generateContent () {
    let content=[];

    if (!this.props.data) {
      console.log ("Error: no data provided");
      return (content);
    }

    if (this.props.data.headers.length==0) {
      console.log ("Error: no data provided");
      return (content);
    }

    let calculatedWidth=(100/this.props.data.headers.length)+"%";

    for (let i=0;i<this.props.data.content.length;i++) {
      let aRow=this.props.data.content [i];

      let selected=aRow.selected;
      let row=[];

      for (let j=0;j<aRow.row.length;j++) {
        let aValue=aRow.row [j];

        if (typeof aValue == "boolean") {
          if (aValue==true) {
            row.push(<td width={calculatedWidth}>true</td>);
          } else {
            row.push(<td width={calculatedWidth}>false</td>);
          }
        } else {
          row.push(<td width={calculatedWidth}>{aValue}</td>);
        }        
      }

      content.push(<tr>{row}</tr>);
    }

    return (content);
  }

  /**
   * 
   */  
  render() {   
    let headings=this.generateHeadings();
    let body=this.generateContent();

    return (
      <div className="kdatatable" style={{margin: "20px"}}>

        <div className="tbl-header">
          <table cellPadding="0" cellSpacing="0" border="0">
            <thead>
              <tr>
              {headings}
              </tr>
            </thead>
          </table>
        </div>

        <div className="tbl-content">
          <table cellPadding="0" cellSpacing="0" border="0">
            <tbody>
            {body}
            </tbody>
          </table>
        </div>
 
        <div className="kdatatable-footer">
        </div> 

      </div>
    );
  }
}

export default KDataTable;
