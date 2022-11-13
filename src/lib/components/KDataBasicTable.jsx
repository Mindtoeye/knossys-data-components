import React, { Component } from 'react';

import { BiChevronDown, BiChevronUp, BiChevronsLeft, BiChevronsRight } from 'react-icons/bi';
import { CgPushChevronLeft, CgPushChevronRight } from 'react-icons/cg';
import { GrTextAlignLeft, GrTextAlignCenter, GrTextAlignRight } from 'react-icons/gr';

import { KButton, KTextInput, KToolbar, KToolbarItem, KWaitSpinner } from '@knossys/knossys-ui-core';

import DataTools from './utils/DataTools';
import KMessage from './KMessage';

import './css/datatable.css';

/**
 *
 */
class KDataBasicTable extends Component {

  /**
   * @param {any} props
   */  
  constructor (props) {
    super (props);

    this.dataTools=new DataTools ();
  }

  /**
   * 
   */
  generateHeadings () {
    let alignment;
    let headings=[];
    let labelclass="kheader-label";

    if (this.props.headers.length==0) {
      return (headings);
    }

    for (let i=0;i<this.props.headers.length;i++) {
      let aHeader=this.props.headers [i];
      let gripper;
      let chevron;
      
      headings.push (<th key={"header-"+i}>
        <div className="kheader-cell">
          <div className={labelclass}>{aHeader}</div>
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
    let cellClass="";

    if (!this.props.data) {
      //console.log ("Info: no data yet");
      return (content);
    }

    //console.log (this.props.data);

    let cellId=0;

    for (let i=0;i<this.props.data.length;i++) {
      let aRow=this.props.data [i];

      let selected=aRow.selected;
      let row=[];

      for (let j=0;j<aRow.length;j++) {
        let aValue=aRow [j];
        let value=aValue;

        row.push(<td className={cellClass} key={"cell-"+cellId}>{value}</td>);

        cellId++;
      }

      content.push(<tr key={"row-"+i}>{row}</tr>);
    }

    return (content);
  }

  /**
   * 
   */
  generateEmpty () {
    return (<div className="kdatatable" style={this.props.styles}>
      <div className="ktable-empty">No data yet</div>
    </div>);
  }

  /**
   * 
   */  
  render() {   
    if (!this.props.data) {
      console.log ("no data");
      return (this.generateEmpty ());
    }

    let headings=this.generateHeadings();
    let body=this.generateContent();

    let table=<div className="ktablecontainer">
        <div className="tbl-header" style={{display: "flex", flexDirection: "row"}}>
          <table cellPadding="0" cellSpacing="0" border="0" style={{width: "100%"}}>
            <thead>
              <tr>
              {headings}
              </tr>
            </thead>
          </table>
          <div className="kdatatable-scrollbarpadding"></div>
        </div>

        <div className="tbl-content">
          <table cellPadding="0" cellSpacing="0" border="0" style={{width: "100%"}}>
            <tbody>
            {body}
            </tbody>
          </table>
        </div>
    </div>;

    return (
      <div className="kdatatable" style={this.props.styles}>
        {table}
      </div>
    );
  }
}

export default KDataBasicTable;
