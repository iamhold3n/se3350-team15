const express = require('express')
const app = express();
const admin = require('firebase-admin');
const Config = require('./config.js');
Config.init();
const port = Config.getConfig("port");
const { body, validationResult } = require('express-validator');
const { auth } = require('firebase-admin');
const { response } = require('express');

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
admin.auth().setCustomUserClaims("IBrv424a2eY3usGCogXZUgSskgK2", { admin: true }).then(() => { });

//debugging test
admin.auth().getUser("3A9c8PeAIYSFy11LtqeQ9R5FFoL2").then((userRecord) =>
{
  //console.log(userRecord.toJSON());
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
    if(token == undefined)
    {
      resolve(false);
    }
    try
    {
    admin.auth().verifyIdToken(token).catch((err) => resolve(false)).then((claims) => //verify the token first
      {
        if(claims["disabled"])
        {
          resolve(false); //nobody with the disabled perm can do anything
        }
        for (var perm in perms)
          {
            if(perms[perm] == claims[perm])
            {
              resolve(true); //if any of them match, resolve true, they have permission
            }
          }
          resolve(false); //if none match, resolve false.
      }).catch((err) =>
      {
        resolve(false); //if the token isn't even properly formatted, fail authentication.
      });
    }
    catch(err)
    {
      resolve(false);//if the token isn't even properly formatted, fail authentication.
    }
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
      if (!val) //if it fails to validate..
      {
        res.status(404).send();
      }
      else {
        const userClaims = req.body;
        console.log(userClaims);
        //expect request to contain:
        //userID: string
        //perms : {}
        //for claims adjustment
        admin.auth().setCustomUserClaims(userClaims["userID"], userClaims["perms"]).then(() => { });
        res.status(200).send();
      }
    }
  )

});

app.get('/api/users/list', (req, res) => //get a list of all users
{
  verifyUser(req.header('authorization'), {"admin": true}).then(
  (val) => {
    if (!val)
    {
      res.status(404).send();
    }
    else
    {
      admin.auth().listUsers().then((results) =>
      {
        //Now to filter these results down to only essential data.
        //assuming the only valid claim types are: admin, faculty, professor, chair
        var list = [];
        for (var i = 0; i < results["users"].length; i++)
        {
          obj = {
            uid : results["users"][i]["uid"],
            email : results["users"][i]["email"],
            claims : results["users"][i]["customClaims"],
            disabled : results["users"][i]["disabled"]
          }
          list.push(obj);
        }
        res.json(list).send();
      }).catch((err) => {});
    }
  }
  )
});

app.put('/api/users', (req, res) => //account creation
{

  verifyUser(req.header('authorization'), { "admin": true }).then(
    (val) => {
      if (!val) //if it fails to validate..
      {
        res.status(404).send();
      }
      else {
        const acc = req.body;
        //expect request to contain:
        //email: string
        //password: string
        admin.auth().createUser({
          email: acc["email"],
          password: generateRandomPassword()
        }).then(
          (resolve) => {
            res.send(true);
          },
          (rej) => {res.send(rej["message"]);}
        );
      }
    }
  )
});

app.get(`/api/users`, (req, res) => //get claims
{
  try
  {
  admin.auth().verifyIdToken(req.header('authorization')).then((claims) =>
  {
    res.send(claims);
  }).catch(() => {
    res.send({});
  }); //send empty obj if it fails to validate. 
}
catch(err)
{
  res.send({});
}
});

// ========================
// DATA RETRIEVAL FUNCTIONS
// ========================
// grab questions for a specific course
app.get('/api/questions/:course', (req, res) => {
  verifyUser(req.header('authorization'), {'professor': true}).then((val) =>
  {
    if(val)
    {
      db.collection('courses').where('courseCode', '==', req.params.course).get().then(q => {
        if (q.empty || q.size > 1) res.status(404).send(); // expecting only one or none to be found, error out if more than 1
        else q.forEach(d => res.status(200).send(d.data()));
      })
    }
    else
    {
      res.status(401).send();
    }
  });
   
});

// grab list of all courses
app.get('/api/courses/', (req, res) => {
  verifyUser(req.header('authorization'), {'professor': true, 'admin': true}).then((val) =>
  {
    if(val)
    {
      db.collection('courses').get().then(all => {
        let allCourses = [];
        all.forEach(c => {
          allCourses.push(c.data());
        })
    
        if (allCourses.length > 0) res.status(200).send(allCourses);
        else res.status(404).send();
      })
    }
    else
    {
      res.status(401).send();
    }
    
  });
  

})

//grab ALL TAs that are in the system
app.get('/api/applicants/',(req,res)=>{
  verifyUser(req.header('authorization'), {'professor': true, 'admin': true, 'chair': true}).then((val) =>
  {
    if(val)
    {
      db.collection('applicants').get().then(all => {
        let allApplicants = [];
        all.forEach(c => {
          allApplicants.push(c.data());
        })
    
        if (allApplicants.length > 0) res.status(200).send(allApplicants);
        else res.status(404).send();
      })
    }
    else
    {
      res.status(401).send();
    }
    
  });
 
})

// grab allocation for all courses
// will be used to allocate hours & TAs to courses
app.get('/api/allocation', (req, res) => {
  verifyUser(req.header('authorization'), {'professor': true, 'admin': true, 'chair': true}).then((val) =>
  {
    if(val)
    {
      db.collection('allocation').get().then(all => {
        let allCourses = [];
        all.forEach(c => {
          allCourses.push(c.data());
        })
    
        if (allCourses.length > 0) res.status(200).send(allCourses);
        else res.status(404).send();
      })
    }
    else
    {
      res.status(401).send();
    }
  });
 
})

// ===========================
// DATA MODIFICATION FUNCTIONS
// ===========================

//add new course
app.put('/api/courses/',
    [body('courseCode').trim().escape(),
    body('courseName').trim().escape(),
    body('labOrTutHrs').trim().escape(),
    body('lecHrs').trim().escape(),
    body('sec').trim().escape()
    ], (req, res) => {
      verifyUser(req.header('authorization'), {'professor': true, 'admin': true, 'chair': true}).then((val) =>
      {
        if(val)
        {
          db.collection('courses').add({
            courseCode: req.body.courseCode,
            courseName: req.body.courseName,
            lecHrs: req.body.lecHrs,
            labOrTutHrs: req.body.labOrTutHrs,
            questions: req.body.questions,
            sec: req.body.sec
          }).then(() => {
            res.status(200).send({ success: 'Courses successfully added.' });
      
          }).catch(err => {
            res.status(403).send({ error: err});
      
      
          })
        }
        else
    {
      res.status(401).send();
    }
      });
    
})

// change course questions
app.post('/api/questions/:course', [
  body('courseCode').trim().escape(),
  body('courseName').trim().escape(),
  body('questions').isArray(),
  body('questions.*').trim().escape(),
  ], (req, res) => {
    verifyUser(req.header('authorization'), {'professor': true}).then((val) =>
    {
      if(val)
      {
        db.collection('courses').where('courseCode', '==', req.params.course).get().then(q => {
          if (q.empty || q.size > 1) res.status(404).send();
          else q.forEach(d => {
            db.collection('courses').doc(d.id).update({ questions : req.body.questions });
            res.status(200).send({ success: 'Questions successfully modified.'});
          })
        })
      }
      else
    {
      res.status(401).send();
    }
    });
   
})

// change allocated hours
app.post('/api/allocation/hrs', [
  body('*').isArray(),
  body('*.course').trim().escape(),
  body('*.currHrs').trim().escape()
], (req, res) => {
  verifyUser(req.header('authorization'), {'chair': true}).then((val) =>
  {
    if(val)
    {
      req.body.forEach(e => {
        db.collection('allocation').where('course', '==', e.course).get().then(x => {
            x.forEach(d => db.collection('allocation').doc(d.id).update({ currHrs : parseInt(e.currHrs) }) )
        })
      })
    
      res.status(200).send({ success: 'Allocated hours successfully modified.' });
    }
    else
    {
      res.status(401).send();
    }
  });
  
})

// change assigned TAs
app.post('/api/allocation/tas', [
  body('*').isArray(),
  body('*.course').trim().escape(),
  body('*.assignList').isArray(),
], (req, res) => {
  verifyUser(req.header('authorization'), {'chair': true}).then((val) =>
  {
    if(val)
    {
      req.body.forEach(e => {
        db.collection('allocation').where('course', '==', e.course).get().then(x => {
            x.forEach(d => db.collection('allocation').doc(d.id).update({ assignList : e.assignList }) )
        })
      })
    
      res.status(200).send({ success: 'Assigned TAs successfully modified.' });
    }
    else
    {
      res.status(401).send();
    }
  });
  
});

// add a course
app.put('/api/courses'), [
  body('courseCode').trim().escape(),
  body('courseName').trim().escape(),
  body('labOrTutHrs').trim().escape(),
  body('lecHrs').trim().escape(),
  body('sec').trim().escape(),
], (req, res) => {
  db.collection('courses').add({
    courseCode: req.body.courseCode,
    courseName: req.body.courseName,
    labOrTutHrs: req.body.labOrTutHrs,
    lecHrs: req.body.lecHrs,
    questions: [],
    sec: req.body.sec
  }).then(() => {
    res.status(200).send({ success: 'Course successfully added.' });
  }).catch(err => {
    res.status(400).send({ error: err });
  })
}

function generateRandomPassword() //generate a random default password
{
  var allowedChars = "qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890!@#%^&*";
  var  length = Math.floor(Math.random() * 8) + 8;
  var output = "";
  for (var i = 0; i < length; i++)
  {
    output += allowedChars.split("")[Math.floor(Math.random() * allowedChars.length)];
  }
  return output;
}
