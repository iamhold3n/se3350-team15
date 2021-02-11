const express = require('express')
const app = express();
const admin = require('firebase-admin');
const port = 3000;

const admin = require('firebase-admin');
const serviceAccount = require('./key/serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
})

const db = admin.firestore();
/*admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: "se3350-tamatchi.firebaseapp.com"
});*/

//Make sure the admin account has full permissions
//Email: admin@uwo.ca
//Password: admin123
//With the current setup, this account will ALWAYS have admin perms. It's password can be changed.
//Probably need a better way to do this at some point.
admin.auth().setCustomUserClaims("IBrv424a2eY3usGCogXZUgSskgK2", {admin : true}).then(() => {});

async function verifyUser(token, perms) //Function for verifying that a token meets a set of claims permissions.
{
  //perms is to be passed as a JSON containing all necessary matches. Ex, to check that a token IS a professor and IS NOT an admin, send:
  //{"professor": true, "admin": false}
  //Both of these must match the token claims for this function to return true.
  //Any additional claims made by the token that are not mentioned in the perms json are disregarded.

  var verifPromise = new Promise(function(resolve, reject)
  {
    admin.auth().verifyIdToken(token).then((claims) => //verify the token first
      {
        for (var perm in perms)
          {
            if(!perms[perm] == claims[perm])
            {
              resolve(false); //if any of them don't match, false
            }
          }
          resolve(true); //if they all match, true
      });
  });
  return verifPromise;
}

app.get('/', (req, res) => {
  res.send('Hello World!')
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
});

