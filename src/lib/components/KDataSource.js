
import DataTools from './utils/DataTools';
import TableTools from './utils/TableTools';

/**
 *
 */
class KDataSource {

  /**
   *
   */
  constructor () {
    this.backend="http://localhost:8055/";

    this.token=this.dataTools.uuidv4();
    this.session=this.dataTools.uuidv4();

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
  generateData () {
    console.log ("generateData ()");

    return (this.getData (0));
  }
 
  /**
   * The developer should already call this method with an in-bounds number, but
   * just in case we do another check here as well
   */  
  getData (pageNr) {
    console.log ("getData ("+pageNr+")");

    this.apiCall ("getdata",this.processData);
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
   * https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
   * {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
       'Content-Type': 'application/json'       
      },
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify(data) // body data type must match "Content-Type" header
    }
   */
  apiCall (aCall,aCallback) {
    console.log ("apiCall ("+aCall+")");

    fetch(this.backend+"/api/v1/"+aCall+"?token="+this.token+"&session="+this.session,{method: "GET"})
      .then(res => res.json())
      .then(
        (result) => {
          if (aCallback) {
            aCallback (result);
          } else {

          }
        },
        // Note: it's important to handle errors here instead of a catch() block so that we 
        // don't swallow exceptions from actual bugs in components.
        (error) => {
           this.error=error;
        }
      );
  }

  /**
   * 
   */
  processData (data) {
    console.log ("processData ()");

    this.currentPage=pageNr;
    
    if (this.currentPage<0) {
      this.currentPage=0;
    }

    if (this.currentPage>(this.nrPages-1)) {
      this.currentPage=(this.nrPages-1);
    }

    let tempData=this.tableTools.getEmptyTable ();
    
    tempData.headers=this.dataTools.deepCopy (data);

    let done=false;
    let index=(this.currentPage*this.pageSize);
    let pIndex=0;
    while (done==false) {
      tempData.content.push(this.dataTools.deepCopy (data.content [index]));

      index++;
      pIndex++;

      if (index>(this.data.content.length-1)) {
        done=true;
      } else {
        if (pIndex>this.pageSize) {
          done=true;
        }
      }
    } 
  }  
}

export default KDataSource;
