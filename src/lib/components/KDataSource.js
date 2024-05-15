
import { KDataTools, KTableTools, KMessage } from '@knossys/knossys-data-portal';

/**
 *
 */
class KDataSource {

  /**
   *
   */
  constructor () {
    this.dataTools=new KDataTools ();
    this.tableTools=new KTableTools ();

    this.token=this.dataTools.uuidv4();
    this.session=this.dataTools.uuidv4();

    this.maxRows=1000;
    this.maxCols=25;

    this.currentPage=0;
    this.nrPages=1;

    this.pageSize=100;

    this.error=null;

    this.standardHeader={
      method: "GET",       
      cache: 'no-cache'
    };

    this.data=this.tableTools.getEmptyTable();

    // Connection management
    this.doDing=this.doDing.bind(this);

    this.backend="";
    this.connected=false;
    this.pingTimer=setInterval(this.doDing,1000); // We can make this fairly tight since it's almost always going to localhost
    this.connectionHandler=null;

    this.updater=null;
  }

  /**
   * 
   */
  setUpdater(aMethod) {
    this.updater=aMethod;
  }

  /**
   * 
   */
  setConnectionHandler (aHandler) {
    this.connectionHandler=aHandler;
  }

  /**
   * 
   */
  setBackend (aURL) {
    this.backend=aURL;
    if (this.backend [this.backend.length-1]!="/") {
      this.backend=aURL+"/";
    }
  }

  /**
   *
   */
  getBackend () {
    if (this.backend [this.backend.length-1]!="/") {
      return (this.backend+"/");
    }

    return (this.backend);
  }

  /**
   *
   */
  doDing () {
    //console.log ("doDing ()");

    let that=this;
    let aURL=this.getBackend()+"api/v1/ding?token="+this.token+"&session="+this.session;

    return new Promise((resolve, reject) => {  
      fetch(aURL,this.standardHeader).then(resp => resp.text()).then((result) => {
        let raw=JSON.parse(result);
        
        /*
        let incomingMessage=new KMessage ();
        incomingMessage.setStatus (KMessage.STATUS_OK);
        incomingMessage.setMessage ("Data retrieved");
        */

        if (that.connected==false) {
          that.connected=true;
          that.connectionHandler (true);
        }
      }).catch((error) => {
        let errorMessage=new KMessage ();

        /*
        errorMessage.setStatus (KMessage.STATUS_ERROR);
        errorMessage.setMessage(error);
        */

        if (that.connected==true) {
          that.connected=false;
          that.connectionHandler (false);
        }        
      });
    });
  }

  /**
   *
   */
  stateFromMessage (aMessage) {
    //console.log ("stateFromMessage ()");
    
    this.maxRows=aMessage.meta.maxRows;
    this.maxCols=aMessage.meta.maxCols;
    this.currentPage=aMessage.meta.currentPage;
    this.nrPages=aMessage.meta.nrPages;
    this.pageSize=aMessage.meta.pageSize;

    //console.log ("nrPages: " + this.nrPages + ", currentPage: " + this.currentPage + ", maxRows: " + this.maxRows + ", maxCols: " + this.maxCols);
    //console.log (aMessage.data);

    this.data=aMessage.data;

    if (this.updater) {
      this.updater ();
    }
  }

  /**
   *
   */
  getMeta () {
    return ({
      maxRows: this.maxRows,
      maxCols: this.maxCols,
      currentPage: this.currentPage,
      nrPages: this.nrPages,
      pageSize: this.pageSize,
      nrCols: this.data.headers.length,
      nrRows: this.data.content.length
    });
  }

  /**
   *
   */
  getTables () {
    //console.log ("getTables ()");
    return (this.apiCall ("gettables",""));
  }
 
  /**
   *
   */
  getData () {
    //console.log ("getData ()");
    return (this.apiCall ("getdata","maxRows="+this.maxRows+"&maxCols="+this.maxCols));
  }
 
  /**
   * The developer should already call this method with an in-bounds number, but
   * just in case we do another check here as well
   */  
  getPage (pageNr) {
    //console.log ("getData ("+pageNr+")");
    return (this.apiCall ("getdatapage","page="+pageNr));
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
  apiCall (aCall,anArgumentSet) {
    //console.log ("apiCall ("+aCall+")");

    let args="";
    if (anArgumentSet) {
      args="&"+anArgumentSet;
    }

    let aURL=this.getBackend()+"api/v1/"+aCall+"?token="+this.token+"&session="+this.session+args;

    return new Promise((resolve, reject) => {  
      fetch(aURL,this.standardHeader).then(resp => resp.text()).then((result) => {
        let raw=JSON.parse(result);
        let incomingMessage=new KMessage ();
        incomingMessage.setStatus (KMessage.STATUS_OK);
        incomingMessage.setMessage ("Data retrieved");
        incomingMessage.fromMessageObject (raw.data,raw.meta);
        resolve (incomingMessage);
      }).catch((error) => {
        console.log (error);
        let errorMessage=new KMessage ();
        errorMessage.setStatus (KMessage.STATUS_ERROR);
        errorMessage.setMessage(error);
        reject(errorMessage);
      });
    });   
  }
}

export default KDataSource;
