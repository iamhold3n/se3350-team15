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
            if(!perms[perm] == claims[perm])
            {
              resolve(false); //if any of them don't match, false
            }
          }
          resolve(true); //if they all match, true
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
  db.collection('courses').doc(req.params.course).get()
    .then(d => res.status(200).send(d.data()))
    .catch(err => res.status(404).send({ error: 'Course not found' }));
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
// will be used to allocate hours & TAs to courses
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
  body('courseCode').trim().escape().exists(),
  body('courseName').trim().escape().exists(),
  body('questions').isArray().exists(),
  body('questions.*').trim().escape().exists()
], (req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  db.collection('courses').doc(req.params.course).get()
    .then(d => {
      db.collection('courses').doc(d.id).update({ questions : req.body.questions });
      res.status(200).send({ success: 'Questions successfully modified.'})
    })
    .catch(err => res.status(404).send({ error: 'Course not found' }));
})

// change allocated hours
app.post('/api/allocation/hrs', [
  body('*.course').trim().escape().exists(),
  body('*.currHrs').isInt().exists()
], (req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  let batch = db.batch();

  req.body.forEach(e => batch.update(db.collection('allocation').doc(e.course), { currHrs : e.currHrs }));

  batch.commit()
    .then(() => res.status(200).send({ success: 'Allocated hours successfully modified.' }))
    .catch(err => res.status(400).send({ error: err }));
})

// change assigned TAs
app.post('/api/allocation/tas', [
  body('*.course').trim().escape().exists(),
  body('*.assignList').isArray().exists()
], (req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  let batch = db.batch();

  req.body.forEach(e => batch.update(db.collection('allocation').doc(e.course), { assignList: e.assignList }));

  batch.commit()
    .then(() => res.status(200).send({ success: 'Assigned TAs successfully modified.' }))
    .catch(err => res.status(400).send({ error: err }));
});

// add a course
app.put('/api/courses', [
  body('courseCode').isLength({ min: 5, max: 9 }).trim().escape().exists(),
  body('courseName').trim().escape().exists(),
  body('labOrTutHrs').isLength({ min: 1, max: 2 }).isInt().exists(),
  body('lecHrs').isLength({ min: 1, max: 2 }).isInt().exists(),
  body('sec').isLength({ min: 1, max: 2 }).isInt().exists()
], (req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  db.collection('courses').doc(req.params.courseCode).set({
    courseCode: req.body.courseCode,
    courseName: req.body.courseName,
    labOrTutHrs: req.body.labOrTutHrs,
    lecHrs: req.body.lecHrs,
    questions: [],
    ranked_applicants: [],
    sec: req.body.sec
  }).then(() => {
    res.status(200).send({ success: 'Course successfully added.' });
  }).catch(err => {
    res.status(400).send({ error: err });
  })
})

// batch add applicants
app.put('/api/batch/applicants', [
  body('*.course').isArray().exists(),
  body('*.email').isEmail().exists(),
  body('*.hrs').isLength({ min: 1, max: 2 }).isInt().exists(),
  body('*.name').trim().escape().exists(),
  body('*.questions').isArray().exists(),
  body('*.ranks').isArray().exists(),
  body('*.status').isLength(1).isInt().exists()
], (req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  let batch = db.batch();

  req.body.forEach(e => batch.set(db.collection('applicants').doc(e.email), e));

  batch.commit()
    .then(() => res.status(200).send({ success: 'Applicants successfully added.' }))
    .catch(err => res.status(400).send({ error: err }));
})

// batch add courses
app.put('/api/batch/courses', [
  body('*.courseCode').isLength({ min: 5, max: 9 }).trim().escape().exists(),
  body('*.courseName').trim().escape().exists(),
  body('*.labOrTutHrs').isLength({ min: 1, max: 2 }).isInt().exists(),
  body('*.lecHrs').isLength({ min: 1, max: 2 }).isInt().exists(),
  body('*.questions').isArray().exists(),
  body('*.sec').isLength({ min: 1, max: 2 }).isInt().exists()
], (req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  let batch = db.batch();

  req.body.forEach(e => {
    batch.set(db.collection('courses').doc(e.courseCode), e);
    batch.update(db.collection('courses').doc(e.courseCode), { ranked_applicants: [] })
  });

  batch.commit()
    .then(() =>  {
      res.status(200).send({ success: 'Courses successfully added.' });
      req.body.forEach(e => checkAllocation(e.courseCode));
    })
    .catch(err => res.status(400).send({ error: err }));
})

// batch add enrolment
app.put('/api/batch/enrolhrs', [
  body('*.courseCode').isLength({ min: 5, max: 9 }).trim().escape().exists(),
  body('*.currEnrol').isLength({ min: 2, max: 3 }).isInt().exists(),
  body('*.labOrTutHrs').isLength({ min: 1, max: 2 }).isInt().exists(),
  body('*.prevEnrol').isLength({ min: 2, max: 3 }).isInt().exists(),
  body('*.prevHrs').isLength({ min: 1, max: 2 }).isInt().exists()
], (req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  let batch = db.batch();

  req.body.forEach(e => batch.set(db.collection('enrolhrs').doc(e.courseCode), e));

  batch.commit()
    .then(() => { 
      res.status(200).send({ success: 'Enrolment information successfully added.' });
      req.body.forEach(e => checkAllocation(e.courseCode));
    })
    .catch(err => res.status(400).send({ error: err }));
})

// batch add instructors
app.put('/api/batch/instructors', [
  body('*.email').isEmail().exists(),
  body('*.name').trim().escape().exists(),
], (req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  let batch = db.batch();

  req.body.forEach(e => batch.set(db.collection('instructors').doc(e.email), e));

  batch.commit()
    .then(() => res.status(200).send({ success: 'Instructors successfully added.' }))
    .catch(err => res.status(400).send({ error: err }));
})

/*function checkAllocation(docID) { // called when new courses are added to see if sufficient information is available to add to allocation database
  db.collection('enrolhrs').doc(docID).get()
    .then(e => {
      console.log('Course found in enrolment.');
      db.collection('courses').doc(docID).get()
      .then(c => {
        console.log('Course found in courses.');
        db.collection('allocation').doc(docID).set({
          assignList: [],
          course: docID,
          currEnrol: e.currEnrol,
          currHrs: (Math.floor(e.currEnrol / e.prevEnrol * e.prevHrs)),
          estHrs: (Math.floor(e.currEnrol / e.prevEnrol * e.prevHrs)),
          labOrTutHrs: c.labOrTutHrs,
          labSections: 0, // present in allocation spreadsheet but not present in any input spreadsheet... 
          prevEnrol: e.prevEnrol,
          prevHrs: e.prevEnrol,
          tutSections: 0 // present in allocation spreadsheet but not present in any input spreadsheet...
        }).then(console.log('Course added to allocation.')).catch(console.log('Error adding to allocation.'));
      }).catch(console.log('Error in courses.')); // course not present in courses database yet
    }).catch(console.log('Error in enrolment.')); // course not present in enrolhrs database yet
}*/

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
