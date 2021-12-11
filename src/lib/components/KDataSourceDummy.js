
import DataTools from './utils/DataTools';
import TableTools from './utils/TableTools';

/**
 *
 */
class KDataSourceDummy {

  /**
   *
   */
  constructor () {
    this.maxRows=1000;
    this.maxCols=25;

    this.currentPage=0;
    this.nrPages=1;

    this.pageSize=100;

    this.error=null;

    this.dataTools=new DataTools ();
    this.tableTools=new TableTools ();

    this.data=this.tableTools.getEmptyTable();
  }

  /**
   *
   */  
  setMaxRows (aSize) {
    this.maxRows=aSize;
  }

  /**
   *
   */  
  setMaxCols (aSize) {
    this.maxCols=aSize;
  }

  /**
   *
   */ 
  setPageSize (aSize) {
    this.pageSize=aSize;
  }

  /**
   *
   */ 
  getPageSize () {
    return (this.pageSize);
  }

  /**
   *
   */ 
  getNrPages () {
    return (this.nrPages);
  }

  /**
   *
   */ 
  getCurrentPage () {
    return (this.currentPage);
  }  

  /**
   *
   */
  getData () {
    console.log ("getData ()");

    this.currentPage=0;
    this.nrPages=1;

    this.data=this.tableTools.generateTableData (this.maxRows,this.maxCols);

    let nrRows=this.data.content.length;

    this.nrPages=nrRows / this.pageSize;

    if (this.pagesize>this.nrRows) {
      this.pageSize=1;
    } else {
      if (this.nrPages<0) {
        this.nrPages=1;
      }

      this.nrPages=Math.ceil(this.nrPages);
    }

    console.log ("Nr rows: " + nrRows + ", page size: " + this.pageSize + ", nr pages: " + this.nrPages);    

    return (this.getPage (0));
  }
 
  /**
   * The developer should already call this method with an in-bounds number, but
   * just in case we do another check here as well
   */  
  getPage (pageNr) {
    console.log ("getPage ("+pageNr+")");

    this.currentPage=pageNr;
    
    if (this.currentPage<0) {
      this.currentPage=0;
    }

    if (this.currentPage>(this.nrPages-1)) {
      this.currentPage=(this.nrPages-1);
    }

    // Create a fresh data set to work in
    let tempData=this.tableTools.getEmptyTable ();
    
    tempData.headers=this.dataTools.deepCopy (this.data.headers);

    let done=false;
    let index=(this.currentPage*this.pageSize);
    let pIndex=0;

    while (done==false) {
      tempData.content.push(this.dataTools.deepCopy (this.data.content [index]));

      index++;
      pIndex++;

      if (index>(this.data.content.length-1)) {
        done=true;
      } else {
        if (pIndex>(this.pageSize-1)) {
          done=true;
        }
      }
    }

    return new Promise((resolve, reject) => {
      resolve(tempData);    
    });    
  }
}

export default KDataSourceDummy;
