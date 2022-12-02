import express from 'express';
const app = express();
const port = 3000;
import fs, { copyFileSync } from 'fs';
import csv from 'csv-parser';

import bodyParser from 'body-parser';

app.use('/', express.static('static'));
app.use(express.json());
app.use(bodyParser.json());

import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, get, child } from 'firebase/database';

const firebaseConfig = {
    apiKey: "AIzaSyDGXZJ2yt5km-Q3aaWYfYsJuUEENX1fhqY",
    authDomain: "web-app-3316.firebaseapp.com",
    databaseURL: "https://web-app-3316-default-rtdb.firebaseio.com",
    projectId: "web-app-3316",
    storageBucket: "web-app-3316.appspot.com",
    messagingSenderId: "590500570550",
    appId: "1:590500570550:web:5e76573c118c6fcf378d17",
    measurementId: "G-P33VQX92NY"
};

initializeApp(firebaseConfig);
const db = getDatabase();

const dbRef = ref(getDatabase());

app.post('/api/secure/list/review', (req, res) => {
    const rating = req.body.rating;
    const comment = req.body.comment;
    const listName = req.body.name;

    const setRef = ref(db, 'lists/' + listName + '/review/');

    set(setRef, {
        rating: rating,
        comment: comment
    });
})

app.post('/api/secure/list', (req, res) => {
    const reqName = req.body.name;
    const reqDescription = req.body.description;
    const reqTracks = req.body.tracks;
    let reqFlag = req.body.flag; 

    let errorExists = false;
    let errorMessage = ' ';

    const setRef = ref(db, 'lists/' + reqName);

    const list = {
        name: reqName,
        description: reqDescription,
        tracks: reqTracks,
        flag: reqFlag
    }; 

    get(child(dbRef, 'lists/')).then((snapshot) => {
        if (snapshot.exists()) {
            const limit = 20;
            if (snapshot.size > (limit-1)) {
                errorExists = true;
                errorMessage = 'You can only create up to 20 playlists';
            }

            else if(snapshot.forEach(child => {
                if (reqName == child.key) { 
                    errorExists = true;
                    errorMessage = `The list with the name '${reqName}' already exists`;
                }
            })) {
            }

            else {
                set(setRef, {
                    name: reqName, 
                    description: reqDescription,
                    tracks: reqTracks,
                    flag: reqFlag
                })
            }
        }
        else {
            set(setRef, {
                name: reqName, 
                description: reqDescription,
                tracks: reqTracks,
                flag: reqFlag
            })
        }

        if (errorExists) {
            res.statusMessage = errorMessage;
            res.status(400).send();
        }
        else {
            res.send(list);
        }
    }).catch((error) => {
        console.log(error);
    })
}); 

app.get('/api/secure/allLists', (req, res) => {
    get(child(dbRef, 'lists/')).then((snapshot) => {
        let listArr = [];
        if (snapshot.exists()) {
            snapshot.forEach(child => {
                listArr.push(child.val());
            })
        }
        res.send(listArr);
    })
})

app.delete('/api/secure/delete/:name', (req, res) => {
    const name = req.params.name;

    let errorExists = true;
    get(child(dbRef, 'lists/')).then((snapshot) => {
        if (snapshot.exists()) {
            const setRef = ref(db, 'lists/' + name);
            snapshot.forEach(child => {
                if (name == child.key) {
                    set(setRef, {});
                    res.send(child.key);
                    errorExists = false;
                }
            })
        }

        if (errorExists) {
            res.status(400).send('not found');
        }
    })
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});