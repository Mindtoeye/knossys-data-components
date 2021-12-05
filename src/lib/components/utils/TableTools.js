
import DataTools from './DataTools';

/**
 *
 */
class TableTools {
  
  constructor () {
    this.dataTools=new DataTools ();
  }

  /**
   *
   */
  getEmptyTable () {
    return({
      headers: [],
      content: []
    });
  }  

  /**
   *
   */
  getType (typeIndex) {
    if (typeIndex==0) {
      return ("string");
    }

    if (typeIndex==1) {
      return ("number");
    }

    if (typeIndex==2) {
      return ("boolean");
    }

    if (typeIndex==3) {
      return ("date");
    }

    return ("string");
  }

  /**
   *
   */
  generateTableData () {
    let nrColumns=this.dataTools.getRandomInt(10);
    if (nrColumns==0) {
      nrColumns=1;
    }

    let nrRows=this.dataTools.getRandomInt(100);
    if (nrRows==0) {
      nrRows=1;
    }

    let generated={
      headers:[],
      content:[]
    }

    for (let i=0;i<nrColumns;i++) {
      let aType=this.getType (this.dataTools.getRandomInt(4));
      let newColumn={ 
        name: (String.fromCharCode(97+i) + " (" + aType + ")"),
        type: aType
      }

      generated.headers.push (newColumn);
    }

    for (let j=0;j<nrRows;j++) {
      let aRow={
        selected: false,
        row: []
      };

      for (let k=0;k<nrColumns;k++) {
        let aCol=generated.headers [k];

        if (aCol.type=="string") {
          aRow.row.push (this.dataTools.makeid(25));
        }

        if (aCol.type=="number") {
          aRow.row.push (this.dataTools.getRandomInt(1000));
        }

        if (aCol.type=="boolean") {
          let aTemp=this.dataTools.getRandomInt(2);
          if (aTemp==1) {
            aRow.row.push (true);
          } else {
            aRow.row.push (false);
          }
        }

        if (aCol.type=="date") {
          aRow.row.push (this.dataTools.getDateString());
        }
      }

      generated.content.push(aRow);
    }

    return (generated);
  }    
}

export default TableTools;
