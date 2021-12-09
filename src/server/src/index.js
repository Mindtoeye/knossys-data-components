import express from 'express';

import KDataSourceDummy from '../..//lib/components/KDataSourceDummy';
import KHashTable from '../../lib/components/utils/KHashTable';

const app = express();
const port = 8055;
const sessions = new KHashTable ();

app.get('/', (req, res) => {
  res.send({
    headers:[],
    content: []
  });
});

app.get('/api/v1/getdata', (req, res) => {
  let session=req.query.session;
  let token=req.query.token;

  let source=sessions.getItem (session);

  if (source==null) {
    source=new KDataSourceDummy ();
    sessions.setItem (session,source);
    source.generateData ();
  }

  let data=source.data;

  res.send(data);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});
