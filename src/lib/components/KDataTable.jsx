import React, { Component } from 'react';

import { BiChevronDown, BiChevronUp, BiChevronsLeft, BiChevronsRight } from 'react-icons/bi';
import { CgPushChevronLeft, CgPushChevronRight } from 'react-icons/cg';
import { GrTextAlignLeft, GrTextAlignCenter, GrTextAlignRight } from 'react-icons/gr';

import { KButton, KTextInput, KToolbar, KToolbarItem } from '@knossys/knossys-ui-core';

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
      showindex: props.showindex,
      table: props.data,
      page: 0,
      pages: 1,
      pagesize: props.pagesize,
      status: "ready",
      wrapText: props.wraptext
    };

    this.onHeaderClick=this.onHeaderClick.bind(this);
    this.onCellClick=this.onCellClick.bind(this);
    this.onPrevious=this.onPrevious.bind(this);
    this.onNext=this.onNext.bind(this);
    this.onEnd=this.onEnd.bind(this);
    this.onBeginning=this.onBeginning.bind(this);    
    this.changeAlignment=this.changeAlignment.bind(this);
  }

  /**
   *
   */
  componentDidUpdate(prevProps) {   
    if (this.props.data !== prevProps.data) {
      let nrRows=this.props.data.content.length;
      let pageCount=nrRows/this.state.pagesize;

      if (pageCount<0) {
        pageCount=1;
      }

      pageCount=Math.ceil(pageCount);

      console.log ("Nr rows: " + nrRows + ", " + " page size: " + this.state.pagesize + ", page count: " + pageCount);

      this.setState ({
        table: this.props.data,
        pages: pageCount,
        wrapText: this.props.wraptext,
        showindex: this.props.showindex
      });
    } else {
      if ((this.props.wraptext !== prevProps.wraptext) || (this.props.showindex !== prevProps.showindex)){
        this.setState ({     
          wrapText: this.props.wraptext,          
          showindex: this.props.showindex
        });
      }    
    }
  }

  /**
   * 
   */
  onHeaderClick (aCol) {
    console.log ("onHeaderClick ("+aCol+")");

    let newTable=this.dataTools.deepCopy (this.state.table);

    for (let i=0;i<newTable.headers.length;i++) {
      let aHeader=newTable.headers [i];
      if (i===aCol) {
        aHeader.selected=true;
      } else {
        aHeader.selected=false;
      }
    }

    this.setState ({
      table: newTable
    });
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
  onPrevious () {
    console.log ("onPrevious ()");

  }

  /**
   * 
   */
  onNext () {
    console.log ("onNext ()");

  }  

  /**
   * 
   */
  onBeginning () {
    console.log ("onBeginning ()");

  }

  /**
   * 
   */
  onEnd () {
    console.log ("onEnd ()");

  }  

  /**
   * 
   */  
  changeAlignment (e,aCol) {
    console.log ("changeAlignment ("+aCol+")");

    e.preventDefault();
    e.stopPropagation();

    let newTable=this.dataTools.deepCopy (this.state.table);

    let aHeader=newTable.headers [aCol];
    
    console.log (aHeader.align);

    if (aHeader.align==="left") {
      aHeader.align="center";
    } else {
      if (aHeader.align==="center") {
        aHeader.align="right";
      } else {
        if (aHeader.align==="right") {
          aHeader.align="left";
        }
      }
    }

    //console.log (newTable);

    this.setState ({
      table: newTable
    });
  }

  /**
   * 
   */
  generateHeadings () {
    let alignment;
    let headings=[];
    let labelclass="kheader-label";

    if (this.props.headeruppercase) {
      if (this.props.headeruppercase=="true") {
        labelclass="kheader-label kuppercase";
      }
    }

    if (!this.state.table) {
      console.log ("Error: no data provided");
      return (headings);
    }

    if (this.state.table.headers.length==0) {
      console.log ("Error: no data provided");
      return (headings);
    }

    let calculatedWidth=(100/this.state.table.headers.length)+"%";

    if (this.state.showindex=="true") {
      calculatedWidth=(100/(this.state.table.headers.length+1))+"%";
      headings.push (<th key={"header-index"} style={{width: "100px"}}>X</th>);
    }

    for (let i=0;i<this.state.table.headers.length;i++) {
      let aHeader=this.state.table.headers [i];
      let gripper;
      let chevron;
      
      if (this.state.table.headers.length>2) {
        if (i<(this.state.table.headers.length-1)) {
          gripper=<div className="kgripper"/>;
        }
      }

      if (this.state.table.headers [i].selected==true) {
        chevron=<div className="kheader-chevron"><BiChevronDown/></div>;
      }

      let tempLabelClass=labelclass;
      
      if (this.state.table.headers [i].align=="left") {
        alignment=<div className="kheader-alignment" onClick={(e) => this.changeAlignment(e,i)}><GrTextAlignLeft/></div>;
        tempLabelClass=labelclass + " ktablealignleft";
      }

      if (this.state.table.headers [i].align=="center") {
        alignment=<div className="kheader-alignment" onClick={(e) => this.changeAlignment(e,i)}><GrTextAlignCenter/></div>;
        tempLabelClass=labelclass + " ktablealigncenter";
      }

      if (this.state.table.headers [i].align=="right") {
        alignment=<div className="kheader-alignment" onClick={(e) => this.changeAlignment(e,i)}><GrTextAlignRight/></div>;
        tempLabelClass=labelclass + " ktablealignright";
      }      

      headings.push (<th key={"header-"+i} width={calculatedWidth}>
        <div className="kheader-cell" onClick={(e) => this.onHeaderClick (i)}>
          <div className={tempLabelClass}>{aHeader.name}</div>
          {chevron}
          {alignment}
          {gripper}
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

    if (!this.state.table) {
      console.log ("Error: no data provided");
      return (content);
    }

    if (this.state.table.headers.length==0) {
      console.log ("Error: no data provided");
      return (content);
    }

    if (this.state.wrapText=="false") {
      cellClass="kdatatablenowrap ";
    }

    let calculatedWidth=(100/this.state.table.headers.length)+"%";

    if (this.state.showindex=="true") {
      calculatedWidth=(100/(this.state.table.headers.length+1))+"%";
    }

    let cellId=0;

    for (let i=0;i<this.state.table.content.length;i++) {
      let aRow=this.state.table.content [i];

      let selected=aRow.selected;
      let row=[];

      if (this.state.showindex=="true") {
        row.push(<td className={cellClass} key={"cell-index-"+cellId} style={{width: "100px"}}>{i+1}</td>);
      }

      for (let j=0;j<aRow.row.length;j++) {
        let aValue=aRow.row [j];
        let value=aValue;

        let aHeader=this.state.table.headers [j];
        let alignClass="ktablealignleft";

        if (aHeader.align=="center") {
          alignClass="ktablealigncenter";
        }

        if (aHeader.align=="right") {
          alignClass="ktablealignright";
        }        

        if (typeof aValue == "boolean") {
          if (aValue==true) {
            value="true";
          } else {
            value="false";
          }
        }        

        row.push(<td className={cellClass + alignClass} key={"cell-"+cellId} width={calculatedWidth} onClick={(e) => this.onCellClick (i,j)}>{value}</td>);

        cellId++;
      }

      content.push(<tr key={"row-"+i}>{row}</tr>);
    }

    return (content);
  }

  /**
   * 
   */
  generateNavigation () {
    return (<div className="kdatatable-footer">
      <KButton size={KButton.TINY} onClick={this.onBeginning} style={{margin: "2px", padding: "1px 7px 1px 7px", fontSize: "14pt", lineHeight: "10pt"}}><CgPushChevronLeft/></KButton>
      <KButton size={KButton.TINY} onClick={this.onPrevious} style={{margin: "2px", padding: "1px 7px 1px 7px", fontSize: "14pt", lineHeight: "10pt"}}><BiChevronsLeft/></KButton>
      <div className="ktable-footer-text">Page: </div>
      <KTextInput size={KTextInput.REGULAR} style={{width: "25px"}} value={(this.state.page+1)}></KTextInput>
      <div className="ktable-footer-text"> / {this.state.pages}  </div>
      <KButton size={KButton.TINY} onClick={this.onNext} style={{margin: "2px", padding: "1px 7px 1px 7px", fontSize: "14pt", lineHeight: "10pt"}}><BiChevronsRight/></KButton>
      <KButton size={KButton.TINY} onClick={this.onEnd} style={{margin: "2px", padding: "1px 7px 1px 7px", fontSize: "14pt", lineHeight: "10pt"}}><CgPushChevronRight/></KButton>
      <div className="ktable-status">{this.state.status}</div>
    </div>);
  }

  /**
   * 
   */  
  render() {   
    let headings=this.generateHeadings();
    let body=this.generateContent();
    let navigation;

    if (this.props.shownavigation) {
      if (this.props.shownavigation=="true") {
        navigation=this.generateNavigation();
      }
    }

    return (
      <div className="kdatatable" style={this.props.styles}>

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
 
        {navigation}

      </div>
    );
  }
}

export default KDataTable;
