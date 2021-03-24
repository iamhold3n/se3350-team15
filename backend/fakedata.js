const admin = require('firebase-admin');
const serviceAccount = require('./apikey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
})
const db = admin.firestore();
const faker = require('faker');

// hard coding parameters, may add command line arguments later
let courseNum = 10;
let instructorsNum = 15;
let enrolhrsNum = 10;
let applicantsNum = 30;
let allocationNum = 10;

// =============
// GENERATE DATA
// =============
let courses = [];
for (let i = 0; i < courseNum; i++) {
    courses.push({
        courseCode: faker.random.arrayElement(['SE', 'ECE']) + (Math.floor(Math.random() * 3) + 1) + Math.floor(Math.random() * 3) + Math.floor(Math.random() * 9) + Math.floor(Math.random() * 9),
        courseName: faker.random.arrayElement(['Intro ', 'Theoretical ', 'Software ', 'Quantum ']) + faker.random.arrayElement(['Design', 'Engineering', 'Foundations', 'Pottery', 'Basket Weaving']),
        labOrTutHrs: Math.floor(Math.random() * 3) + 1,
        lecHrs: Math.floor(Math.random() * 4) + 1,
        questions: uniqueQuestions(),
        sec: Math.floor(Math.random() * 4) + 1
    })
}

let instructors = [];
for (let i = 0; i < instructorsNum; i++) {
    let fname = faker.name.firstName();
    let lname = faker.name.lastName();

    instructors.push({
        email: faker.internet.email(fname, lname, 'uwo.ca'),
        name: fname + ' ' + lname
    })
}

let enrolhrs = [];
for (let i = 0; i < enrolhrsNum; i++) {
    enrolhrs.push({
        courseCode: courses[i].courseCode,
        currEnrol: Math.floor(Math.random() * 150) + 100,
        labOrTutHrs: courses[i].labOrTutHrs,
        prevEnrol: Math.floor(Math.random() * 150) + 100,
        prevHrs: Math.floor(Math.random() * 20) + 15,
    })
}

let applicants = [];
for (let i = 0; i < applicantsNum; i++) {
    let c = uniqueCourses();
    let fname = faker.name.firstName();
    let lname = faker.name.lastName();

    applicants.push({
        course: getCourses(c),
        email: faker.internet.email(fname, lname, 'uwo.ca'),
        hrs: (Math.floor(Math.random() * 2) + 1)*5,
        name: fname + ' ' + lname,
        questions: questionAnswers(c),
        ranks: getRanks(c.length),
        status: Math.floor(Math.random() * 3) + 1
    })
}

let allocation = [];
for (let i = 0; i < allocationNum; i++) {
    let hours = Math.floor(Math.random() * 20) + 15;
    allocation.push({
        course: courses[i].courseCode,
        currEnrol: enrolhrs[i].currEnrol,
        currHrs: hours,
        estHrs: (Math.floor(enrolhrs[i].currEnrol / enrolhrs[i].prevEnrol * enrolhrs[i].prevHrs)),
        labOrTutHrs: courses[i].labOrTutHrs,
        labSections: Math.floor(Math.random() * 4),
        prevEnrol: enrolhrs[i].prevEnrol,
        prevHrs: enrolhrs[i].prevHrs,
        tutSections: Math.floor(Math.random() * 4)
    })
}

function uniqueQuestions() {
    let q = new Set();
    let max = Math.floor(Math.random() * 4) + 1;
    while(q.size < max) {
        q.add(faker.random.arrayElement(['Know Java?','Know Javascript?','Know Matlab?','Know C++?','Know C?','Know Rust?','Know Python?','Know Ruby?','Know R?','Teaching certificate?','Know DBMS?']));
    }

    return Array.from(q);
}

function uniqueCourses() {
    let c = new Set();
    let max = Math.floor(Math.random() * 4) + 1;
    while(c.size < max) {
        c.add(Math.floor(Math.random() * (courseNum - 1)))
    }

    return Array.from(c);
}

function getCourses(c) {
    let cArr = [];
    c.forEach(x => cArr.push(courses[x].courseCode));

    return cArr;
}

function getRanks(sz) { // making it simple and doing it 1 to max in order
    let r = [];
    for (let i = 0; i < sz; i++) r.push(i+1);

    return r;
}

function questionAnswers(cArr) {
    let uq = new Set();
    let qa = [];
    
    for (let i = 0; i < cArr.length; i++) {
        courses[cArr[i]].questions.forEach(q => uq.add(q))
    }

    uq.forEach(e => {
        qa.push({
            question: e,
            answer: faker.random.boolean()
        })
    })

    return qa;
}

// ===========
// UPLOAD DATA
// ===========
courses.forEach(x => {
    db.collection("courses").doc(x.courseCode).set({
        courseCode: x.courseCode,
        courseName: x.courseName,
        labOrTutHrs: x.labOrTutHrs,
        lecHrs: x.lecHrs,
        questions: x.questions,
        ranked_applicants: [],
        sec: x.sec
    }).then(x => {
        console.log("Added course")
    }).catch(x => {
        console.log("Error: ", error);
    })
})

instructors.forEach(x => {
    db.collection("instructors").doc(x.email).set({
        name: x.name,
        email: x.email,
        course: []
    }).then(x => {
        console.log("Added instructor")
    }).catch(e => {
        console.log("Error: ", e);
    })
})

enrolhrs.forEach(x => {
    db.collection("enrolhrs").doc(x.courseCode).set({
        courseCode: x.courseCode,
        labOrTutHrs: x.labOrTutHrs,
        prevEnrol: x.prevEnrol,
        prevHrs: x.prevHrs,
        currEnrol: x.currEnrol
    }).then(x => {
        console.log("Added course info");
    }).catch(e => {
        console.log("Error: " + e);
    })
})

applicants.forEach(x => {
    db.collection("applicants").doc(x.email).set({
        course: x.course,
        name: x.name,
        email: x.email,
        hrs: x.hrs,
        status: x.status,
        ranks: x.ranks,
        questions: x.questions
    }).then(x => {
        console.log("Added applicant");
    }).catch(e => {
        console.log("Error: " + e);
    })
})

allocation.forEach(x => {
    db.collection("allocation").doc(x.course).set({
        assignList: [],
        course: x.course,
        labSections: x.labSections,
        labOrTutHrs: x.labOrTutHrs,
        tutSections: x.tutSections,
        prevEnrol: x.prevEnrol,
        prevHrs: x.prevHrs,
        currEnrol: x.currEnrol,
        estHrs: x.estHrs,
        currHrs: x.currHrs
    }).then(x => {
        console.log("Added allocation");
    }).catch(e => {
        console.log("Error: " + e);
    })
})
