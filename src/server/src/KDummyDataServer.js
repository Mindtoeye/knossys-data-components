import express from 'express';

import KHashTable from '../../lib/components/utils/KHashTable';
import DataTools from '../../lib/components/utils/DataTools';
import TableTools from '../../lib/components/utils/TableTools';
import KDataSourceDummy from '../..//lib/components/KDataSourceDummy';
import KMessage from '../..//lib/components/KMessage';

/**
 * 
 */
class KDummyDataServer {

  /**
   * 
   */
  constructor () {
    this.app = express();
    this.port = 8055;
    this.sessions = new KHashTable ();

    this.dataTools=new DataTools ();
    this.tableTools=new TableTools ();

    this.processRoot=this.processRoot.bind(this);
    this.processDataGet=this.processDataGet.bind(this);
    this.processDataGetPage=this.processDataGetPage.bind(this);    

    this.app.get('/',this.processRoot);
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
  processDataGet (req,res) {
    console.log("processDataGet ()");

    let session=req.query.session;
    let token=req.query.token;

    let source=this.sessions.getItem (session);

    if (source==null) {
      source=new KDataSourceDummy ();
      sessions.setItem (session,source);    
    }

    source.getData ();

    let reply=new KMessage ();
    reply.setStatus (KMessage.STATUS_OK);
    reply.setData (source.data);

    res.send(reply.getMessageObject ());
  }

  /**
   * 
   */
  processDataGetPage (req,res) {
    console.log("processDataGetPage ()");

    let session=req.query.session;
    let token=req.query.token;
    let page=req.query.page;

    let source=this.sessions.getItem (session);

    if (source==null) {      
      return ({
        status: "error",
        message: "Error: no page argument provided"
      });
    }

    source.getPage (parseInt(page)).then ((data) => {
      let reply=new KMessage ();
      reply.setStatus (KMessage.STATUS_OK);
      reply.setData (source.data);
      res.send(reply.getMessageObject ());   
    });
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
