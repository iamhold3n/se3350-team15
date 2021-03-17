const express = require('express')
const app = express();
const admin = require('firebase-admin');
const Config = require('./config.js');
Config.init();
const port = Config.getConfig("port");
const { body, validationResult } = require('express-validator');

admin.initializeApp({
  credential: admin.credential.cert(Config.getConfig("apikey")),
  databaseURL: Config.getConfig("databaseURL")
});

const db = admin.firestore();

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

app.put('/api/allocation', (req, res) =>
{
});

// ========================
// DATA RETRIEVAL FUNCTIONS
// ========================
// grab questions for a specific course
app.get('/api/questions/:course', (req, res) => {
  db.collection('courses').where('courseCode', '==', req.params.course).get().then(q => {
    if (q.empty || q.size > 1) res.status(404).send(); // expecting only one or none to be found, error out if more than 1
    else q.forEach(d => res.status(200).send(d.data()));
  })
});

// grab list of all courses
app.get('/api/courses/', (req, res) => {
  db.collection('courses').get().then(all => {
    let allCourses = [];
    all.forEach(c => {
      allCourses.push(c.data());
    })

    if (allCourses.length > 0) res.status(200).send(allCourses);
    else res.status(404).send();
  })

})

// grab list of all allocations
// aka: Course data which is relevant to the TA matching algorithm
app.get('/api/allocations/', (req, res) => {
  db.collection('allocation').get().then(all => {
    let allCourses = [];
    all.forEach(c => {
      allCourses.push(c.data());
    })

    if (allCourses.length > 0) res.status(200).send(allCourses);
    else res.status(404).send();
  })
})

//grab ALL TAs that are in the system
app.get('/api/applicants/',(req,res)=>{
  db.collection('applicants').get().then(all => {
    let allApplicants = [];
    all.forEach(c => {
      allApplicants.push(c.data());
    })

    if (allApplicants.length > 0) res.status(200).send(allApplicants);
    else res.status(404).send();
  })
})

// grab allocation for all courses
app.get('/api/allocation', (req, res) => {
  db.collection('allocation').get().then(all => {
    let allCourses = [];
    all.forEach(c => {
      allCourses.push(c.data());
    })

    if (allCourses.length > 0) res.status(200).send(allCourses);
    else res.status(404).send();
  })
})

// ===========================
// DATA MODIFICATION FUNCTIONS
// ===========================
// change course questions
app.post('/api/questions/:course', [
  body('courseCode').trim().escape(),
  body('courseName').trim().escape(),
  body('questions').isArray(),
  body('questions.*').trim().escape(),
  ], (req, res) => {
    db.collection('courses').where('courseCode', '==', req.params.course).get().then(q => {
      if (q.empty || q.size > 1) res.status(404).send();
      else q.forEach(d => {
        db.collection('courses').doc(d.id).update({ questions : req.body.questions });
        res.status(200).send({ success: 'Questions successfully modified.'});
      })
    })
})

// change allocated hours
app.post('/api/allocation', [
  body('*').isArray(),
  body('*.course').trim().escape(),
  body('*.currHrs').trim().escape()
], (req, res) => {
  req.body.forEach(e => {
    db.collection('allocation').where('course', '==', e.course).get().then(x => {
        x.forEach(d => db.collection('allocation').doc(d.id).update({ currHrs : e.currHrs }) )
    })
  })

  res.status(200).send({ success: 'Allocated hours successfully modified.' });
})
