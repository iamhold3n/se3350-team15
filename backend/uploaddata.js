const admin = require('firebase-admin');
const serviceAccount = require('./key/serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
})

const db = admin.firestore();

// DON'T RUN UNLESS YOU WANT DUPLICATE ENTRIES IN OUR DATABASE

const courses = require('./data/courses.json');
courses.forEach(x => {
    db.collection("courses").add({
        courseCode: x.courseCode,
        courseName: x.courseName,
        lecHrs: x.lecHrs,
        labHrs: x.labHrs,
        tutHrs: x.tutHrs,
        sec: x.sec
    }).then(x => {
        console.log("Added course")
    }).catch(x => {
        console.log("Error: ", error);
    })
})

const instructors = require('./data/instructors.json');
instructors.forEach(x => {
    db.collection("instructors").add({
        name: x.name,
        email: x.email
    }).then(x => {
        console.log("Added instructor")
    }).catch(e => {
        console.log("Error: ", e);
    })
})

const enrolhrs = require('./data/enrolhrs.json')
enrolhrs.forEach(x => {
    db.collection("enrolhrs").add({
        courseCode: x.courseCode,
        labHrs: x.labHrs,
        tutHrs: x.tutHrs,
        prevEnrol: x.prevEnrol,
        prevHrs: x.prevHrs,
        currEnrol: x.currEnrol
    }).then(x => {
        console.log("Added course info");
    }).catch(e => {
        console.log("Error: " + e);
    })
})

const applicants = require('./data/applicants.json')
applicants.forEach(x => {
    db.collection("applicants").add({
        course: x.course,
        name: x.name,
        email: x.email,
        status: x.status,
        questions: x.questions
    }).then(x => {
        console.log("Added applicant");
    }).catch(e => {
        console.log("Error: " + e);
    })
})

const allocation = require('./data/allocation.json')
allocation.forEach(x => {
    db.collection("allocation").add({
        instructor: x.instructor,
        course: x.course,
        labSections: x.labSections,
        labHrs: x.labHrs,
        tutSections: x.tutSections,
        tutHrs: x.tutHrs,
        prevEnrol: x.prevEnrol,
        prevHrs: x.prevHrs,
        currEnrol: x.currEnrol,
        estHrs: x.estHrs,
        currHrs: x.currHrs,
        ta: x.ta
    }).then(x => {
        console.log("Added allocation");
    }).catch(e => {
        console.log("Error: " + e);
    })
})
