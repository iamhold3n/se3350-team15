const express = require('express')
const app = express();
const port = 3000;

const admin = require('firebase-admin');
const serviceAccount = require('./key/serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
})

const db = admin.firestore();

app.get('/', (req, res) => {
  res.send('Hello World!')
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
});
