import express, { raw } from 'express';
const app = express();
const port = 3000;
import fs from 'fs';
import csv from 'csv-parser';

import bodyParser from 'body-parser';
import bcrypt from 'bcrypt';

app.use('/', express.static('static'));
app.use(express.json());
app.use(bodyParser.json());

import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, get, child } from 'firebase/database';

const firebaseApp = initializeApp({
    apiKey: "AIzaSyDGXZJ2yt5km-Q3aaWYfYsJuUEENX1fhqY",
    authDomain: "web-app-3316.firebaseapp.com",
    databaseURL: "https://web-app-3316-default-rtdb.firebaseio.com",
    projectId: "web-app-3316",
    storageBucket: "web-app-3316.appspot.com",
    messagingSenderId: "590500570550",
    appId: "1:590500570550:web:5e76573c118c6fcf378d17",
    measurementId: "G-P33VQX92NY"
});

const db = getDatabase(firebaseApp);

const dbRef = ref(getDatabase());

app.set('view engine', 'ejs');

// task 2: deactive user account
app.post('/users/login/deactivate', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const emailVerified = req.body.emailVerified;
    const accountStatus = req.body.accountStatus;

    get(child(dbRef, 'users/' + email)).then(async (snapshot) => {
        if (snapshot.exists()) {
            const setRef = ref(db, 'users/' + email);

            try {
                const hashedPasssword = await bcrypt.hash(password, 10);
                const user = { 
                    email: email,
                    password: hashedPasssword,
                    emailVerified: emailVerified,
                    accountStatus: accountStatus
                }
                
                const setRef = ref(db, 'users/' + email);
                
                set(setRef, user);
                res.send('Success');
            } catch {
                res.statusMessage = 'Server error in /user/login/verify';
                res.status(500).send();
            }
        }
        else {
            res.status(400).send();
        }
    })
})

// task 2: add database users to array
app.get('/users', (req, res) => {
    get(child(dbRef, 'users/')).then((snapshot) => {
        if (snapshot.exists()) {
            const userList = [];
            snapshot.forEach(user => {
                userList.push(user.val());
            })
            res.send(userList);
        }
    }).catch((error) => {
        console.log(error);
    })
})

// tsak 2: get password for selected email
app.get('/users/login/password/:email', (req, res) => {
    const email = req.params.email;

    get(child(dbRef, 'users/' + email)).then((snapshot) => {
        if (snapshot.exists()) {
            const password = {
                password: snapshot.child('password').val()
            }
            res.send(password);
        }
        else {
            res.statusMessage = 'Error in /users/login/password/:email get call'
            res.status(400).send();
        }
    })
})

// task 2: verify user, use bcrypt to hash password and store in database
app.post('/users/login/verify', async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const emailVerified = req.body.emailVerified;
    const accountStatus = req.body.accountStatus;

    try {
        const hashedPasssword = await bcrypt.hash(password, 10);
        const user = { 
            email: email,
            password: hashedPasssword,
            emailVerified: emailVerified,
            accountStatus: accountStatus
        }
        
        const setRef = ref(db, 'users/' + email);
        set(setRef, user);

        res.send(user);
    } catch {
        res.statusMessage = 'Server error in /user/login/verify';
        res.status(500).send();
    }
})

// task 2: create new user in database and set hashed password
app.post('/users', async (req, res) => { 
    const email = req.body.email;
    const password = req.body.password;
    const emailVerified = req.body.emailVerified;
    const accountStatus = req.body.accountStatus;

    get(child(dbRef, 'users/' + email)).then(async (snapshot) => {
        if (snapshot.child('email').val() == email) {
            res.statusMessage = 'Account with that email already exists';
            res.status(400).send();
        }
        else {
            res.send('Success');

            try {
                const hashedPasssword = await bcrypt.hash(password, 10);
                const user = { 
                    email: email,
                    password: hashedPasssword,
                    emailVerified: emailVerified,
                    accountStatus: accountStatus
                }
                
                const setRef = ref(db, 'users/' + email);
                set(setRef, user);
        
                res.send(user);
            } catch {
                res.statusMessage = 'Server error in /users post call';
                res.status(500).send();
            }
        }
    })
}) 

// task 2: update password
app.post('/users/login/password/update', (req, res) => {
    const password = req.body.password;
    const email = req.body.email;
    get(child(dbRef, 'users/' + email)).then(async (snapshot) => {
        if (snapshot.exists()) {
            console.log(snapshot.val());
            try {
                const hashedPasssword = await bcrypt.hash(password, 10);
                const setRef = ref(db, 'users/' + email + '/password');
                set(setRef, hashedPasssword);
                res.send('Success');
            } catch {
                res.statusMessage = 'Server error';
                res.status(500).send();
            }
        }
    })
})

// task 2: login for user, check conditions and validate
app.post('/users/login', async (req, res) => {
    get(child(dbRef, 'users/' + req.body.email)).then(async (snapshot) => {
        if (snapshot.exists()) {
            if (snapshot.child('emailVerified').val() == 'n') {
                res.statusMessage = 'Please verify email and try again';
                res.status(400).send();
            }
            else {
                if (snapshot.child('accountStatus').val() == 'deactivated') {
                    res.statusMessage = 'Your account has been deactivated, please contact the administrator';
                    res.status(400).send();
                }
                else {
                    if (await bcrypt.compare(req.body.password, snapshot.child('password').val())) {
                        res.send('Success');
                    }
                    else {
                        res.statusMessage = 'Login was unsuccessful, password is incorrect';
                        res.status(400).send();
                    }
                }
            }
        }
        else {
            res.statusMessage = 'Login was unsuccessful, account with that email does not exist';
            res.sendStatus(400).send();
        }
    })
})
//ADMIN FUNCTIONS
//Set a user as admin
app.post('/users/admin', (req, res) => {
    const email = req.body.email;
    const admin = req.body.admin;
    get(child(dbRef, 'users/' + email)).then((snapshot) => {
        if (snapshot.exists()) {
            const setRef = ref(db, 'users/' + email + '/admin');
            set(setRef, admin);
            res.send('Success');
        }
        else {
            res.statusMessage = 'Error in /users/admin post call';
            res.status(400).send();
        }
    })
})
//remove admin privileges from a user
app.post('/users/admin/remove', (req, res) => {
    const email = req.body.email;
    get(child(dbRef, 'users/' + email)).then((snapshot) => {
        if (snapshot.exists()) {
            const setRef = ref(db, 'users/' + email + '/admin');
            set(setRef, 'n');
            res.send('Success');
        }
        else {
            res.statusMessage = 'Error in /users/admin/remove post call';
            res.status(400).send();
        }
    })
})
//set a review as hidden
app.post('/reviews/hide', (req, res) => {
    const reviewID = req.body.reviewID;
    get(child(dbRef, 'reviews/' + reviewID)).then((snapshot) => {
        if (snapshot.exists()) {
            const setRef = ref(db, 'reviews/' + reviewID + '/hidden');
            set(setRef, 'y');
            res.send('Success');
        }
        else {
            res.statusMessage = 'Error in /reviews/hide post call';
            res.status(400).send();
        }
    })
})
//unhide a review
app.post('/reviews/unhide', (req, res) => {
    const reviewID = req.body.reviewID;
    get(child(dbRef, 'reviews/' + reviewID)).then((snapshot) => {
        if (snapshot.exists()) {
            const setRef = ref(db, 'reviews/' + reviewID + '/hidden');
            set(setRef, 'n');
            res.send('Success');
        }
        else {
            res.statusMessage = 'Error in /reviews/unhide post call';
            res.status(400).send();
        }
    })
})
//ban a user
app.post('/users/ban', (req, res) => {
    const email = req.body.email;
    get(child(dbRef, 'users/' + email)).then((snapshot) => {
        if (snapshot.exists()) {
            const setRef = ref(db, 'users/' + email + '/accountStatus');
            set(setRef, 'banned');
            res.send('Success');
        }
        else {
            res.statusMessage = 'Error in /users/ban post call';
            res.status(400).send();
        }
    })
})
//unban a user
app.post('/users/unban', (req, res) => {
    const email = req.body.email;
    get(child(dbRef, 'users/' + email)).then((snapshot) => {
        if (snapshot.exists()) {
            const setRef = ref(db, 'users/' + email + '/accountStatus');
            set(setRef, 'active');
            res.send('Success');
        }
        else {
            res.statusMessage = 'Error in /users/unban post call';
            res.status(400).send();
        }
    })
})


app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});