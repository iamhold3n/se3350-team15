const express = require('express')
const app = express();
const admin = require('firebase-admin');
const Config = require('./config.js');
Config.init();
const port = Config.getConfig("port");

admin.initializeApp({
  credential: admin.credential.cert(Config.getConfig("apikey")),
  databaseURL: Config.getConfig("databaseURL")
});

//Make sure the admin account has full permissions
//Email: admin@uwo.ca
//Password: admin123
//With the current setup, this account will ALWAYS have admin perms. It's password can be changed.
//Probably need a better way to do this at some point.
admin.auth().setCustomUserClaims("IBrv424a2eY3usGCogXZUgSskgK2", {admin : true}).then(() => {});

//debugging test
admin.auth().getUser("3A9c8PeAIYSFy11LtqeQ9R5FFoL2").then((userRecord) =>
{
  console.log(userRecord.toJSON());
})

async function verifyUser(token, perms) //Function for verifying that a token meets a set of claims permissions.
{
  //perms is to be passed as a JSON containing all necessary matches. Ex, to check that a token IS a professor and IS NOT an admin, send:
  //{"professor": true, "admin": false}
  //Both of these must match the token claims for this function to return true.
  //Any additional claims made by the token that are not mentioned in the perms json are disregarded.

  //debug line to allow all verification to pass
  /*return new Promise(function(resolve, reject)
  {
    console.log("TURN OFF DEBUG MODE IN INDEX");
    resolve(true);
  });*/


  var verifPromise = new Promise(function(resolve, reject)
  {
    admin.auth().verifyIdToken(token).then((claims) => //verify the token first
      {
        if(claims["disabled"])
        {
          resolve(false); //nobody with the disabled perm can do anything
        }
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

app.get('/', (req, res, next) => {
  console.log(`Received ${req.method} request for ${req.url}`);
    res.append('Access-Control-Allow-Origin', ['*']); //adding headers here
    res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.append('Access-Control-Allow-Headers', 'Content-Type');
    res.append('Access-Control-Allow-Headers', 'authorization');
    next(); //then continue
});

app.listen(port, () => {
  console.log(`TAMatchi listening on port ${port}!`)
});

app.use(express.json());
app.post('/api/users', (req, res) => {  //adjust user permissions

  verifyUser(req.header('authorization'), {"admin" : true}).then(
    (val) => {
      if(!val) //if it fails to validate..
      {
        res.status(404).send();
      }
      else
      {
        const userClaims = req.body;
        //expect request to contain:
        //userID: string
        //perms : {}
        //for claims adjustment
        admin.auth().setCustomUserClaims(userClaims["userID"], userClaims["perms"]).then(() => {});
        res.status(200).send();
      }
    }
  )

});

app.put('/api/users', (req, res) =>
{

   verifyUser(req.header('authorization'), {"admin" : true}).then(
    (val) => {
      if(!val) //if it fails to validate..
      {
        res.status(404).send();
      }
      else
      {
        const acc = req.body;
        //expect request to contain:
        //email: string
        //password: string
        admin.auth().createUser({
          email: acc["email"],
          password: acc["password"]
        }).then(
          (resolve) => {res.status(200).send();},
          (rej) => {res.send(rej["message"]);}
        );
      }
    }
  )
});
