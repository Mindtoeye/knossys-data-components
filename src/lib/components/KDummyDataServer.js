import express from 'express';

import KHashTable from './utils/KHashTable';
import DataTools from './utils/DataTools';
import TableTools from './utils/TableTools';
import KDataSourceDummy from './KDataSourceDummy';
import KMessage from './KMessage';

/**
 * 
 */
class KDummyDataServer {

  /**
   * 
   */
  constructor () {
    this.app = express();
    this.app.use(express.json());
    this.port = 8055;
    this.sessions = new KHashTable ();

    this.dataTools=new DataTools ();
    this.tableTools=new TableTools ();

    this.processRoot=this.processRoot.bind(this);
    this.processTablesGet=this.processTablesGet.bind(this);
    this.processDataGet=this.processDataGet.bind(this);
    this.processDataGetPage=this.processDataGetPage.bind(this);    

    this.app.get('/',this.processRoot);
    this.app.get('/api/v1/gettables',this.processTablesGet);
    this.app.get('/api/v1/getdata',this.processDataGet);
    this.app.get('/api/v1/getdatapage',this.processDataGetPage);
  }

  /**
   * 
   */
  processRoot (req,res) {
    console.log("processRoot ()");
    res.send(this.tableTools.getEmptyTable());    
  }

  /**
   * 
   */
  processTablesGet (req,res) {
    console.log("processTablesGet ()");

    res.setHeader('Access-Control-Allow-Origin', '*');

    let data=[];

    let maxTables=this.dataTools.getRandomInt (25);

    for (let i=0;i<maxTables;i++) {
      data.push (this.dataTools.makeid (15));
    }

    let reply=new KMessage (KMessage.STATUS_OK,data,null);

    reply.meta.command="gettables";

    res.send(reply.getMessageObject ());      
  }

  /**
   * 
   */
  processDataGet (req,res) {
    console.log("processDataGet ()");

    res.setHeader('Access-Control-Allow-Origin', '*');

    let session=req.query.session;
    let token=req.query.token;

    if (session==null) {
      let reply=new KMessage (KMessage.STATUS_ERROR,"Error: no session data provided in call",null);
      res.send(reply.getMessageObject ());
      return;
    }

    if (token==null) {
      let reply=new KMessage (KMessage.STATUS_ERROR,"Error: no token provided in call",null);
      res.send(reply.getMessageObject ());
      return;      
    }    

    let source=this.sessions.getItem (session);

    if (source==null) {
      source=new KDataSourceDummy ();

      this.sessions.setItem (session,source);    
    }

    let aMaxRows=req.query.maxRows;
    let aMaxCols=req.query.maxCols;

    if ((aMaxCols!=null) && (aMaxRows!=null)) {
      source.maxCols=parseInt (aMaxCols);
      source.maxRows=parseInt (aMaxRows);

      console.log ("Bound data generation to " + source.maxRows + " rows and " + source.maxCols + " columns");
    }

    source.getData ().then ((data) => {
      let reply=new KMessage (KMessage.STATUS_OK,data,null);

      reply.meta=source.getMeta ();
      reply.meta.command="getdata";

      res.send(reply.getMessageObject ());   
    });
  }

  /**
   * 
   */
  processDataGetPage (req,res) {
    console.log("processDataGetPage ()");

    res.setHeader('Access-Control-Allow-Origin', '*');    

    let session=req.query.session;
    let token=req.query.token;
    let page=req.query.page;

    if (session==null) {
      let reply=new KMessage (KMessage.STATUS_ERROR,"Error: no session data provided in call",null);
      res.send(reply.getMessageObject ());
      return;
    }

    if (token==null) {
      let reply=new KMessage (KMessage.STATUS_ERROR,"Error: no token provided in call",null);
      res.send(reply.getMessageObject ());
      return;      
    }

    if (page==null) {
      let reply=new KMessage (KMessage.STATUS_ERROR,"Error: no page number provided in call",null);
      res.send(reply.getMessageObject ());
      return;      
    }      

    let source=this.sessions.getItem (session);

    if (source==null) {      
      let reply=new KMessage (KMessage.STATUS_ERROR,"Error: no page argument provided",null);      
      res.send(reply.getMessageObject ());   
    } else {
      let aPage=parseInt(page);

      console.log ("Retrieving page: " + aPage);

      source.getPage (aPage).then ((data) => {
        let reply=new KMessage (KMessage.STATUS_OK,data,null);

        reply.meta=source.getMeta ();
        reply.meta.command="getdatapage";

        res.send(reply.getMessageObject ());   
      });
    }
  }

  /**
   * 
   */
  run () {
    this.app.listen(this.port, () => {
      console.log("Example app listening at http://localhost: " + this.port);
    });
  }
}

export default KDummyDataServer;
