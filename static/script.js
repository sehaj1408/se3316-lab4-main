const loginPage = document.getElementById('login-page');
if (loginPage) {
    loginPage.style.display = 'none';
}

const authenticatedDiv = document.getElementById('authenticated-user-div');
if (authenticatedDiv) {
    const id = document.getElementById('login-id');
    authenticatedDiv.style.display = 'none';
}

const unauthenticatedDiv = document.getElementById('unauthenticated-user-div');
if (unauthenticatedDiv) {
    unauthenticatedDiv.style.display = 'block';
}

const addListBtn = document.getElementById('create-list');
if (addListBtn) {
    addListBtn.addEventListener('click', createList);
}

const showLogin = document.getElementById('show-login-page');
if (showLogin) {
    showLogin.addEventListener('click', showLoginPage);
}

function showLoginPage() {
    loginPage.style.display = 'block';
    unauthenticatedDiv.style.display = 'none';
}

function validatenewListInput(name, track, flag, description) {
    if (name == null || name == "") {
        alert('Name is required');
        return false;
    }
    else if (track == null || track == "") {
        alert('Track is required');
        return false;
    }

    if (flag == null || flag == '') {
        flag = 'private';
    }

    if (description == null || description == '') {
        description = '(no description)'
    }

    if ((flag == 'private') || (flag == 'public')) {
       // fine 
    }
    else {
        alert('Flag can only be "public" or "private"');
        return false;
    }

    let arr = [name, track, flag, description];

    return (arr);
}

// USE ANGULAR !!

function createList() {
    let name = document.getElementById('get-list-name').value.toLowerCase();
    let description = document.getElementById('get-list-description').value.toLowerCase();
    let track = document.getElementById('get-list-track').value;
    let flag = document.getElementById('get-list-flag').value.toLowerCase();

    const bodyArr = validatenewListInput(name, track, flag, description);

    if (bodyArr) {
        fetch(`/api/tracks/${bodyArr[1]}`)
        .then(res => {
            if (res.ok) {
                
                // res.json()
                // .catch(err => console.log('Failed to get json object at first'))
                
                let today = new Date();
                let dd = String(today.getDate()).padStart(2, '0');
                let mm = String(today.getMonth() + 1).padStart(2, '0');
                let yyyy = today.getFullYear();
                today = mm + '/' + dd + '/' + yyyy;

                fetch('/api/secure/list', {
                    method: 'POST',
                    headers: {'Content-type': 'application/json'},
                    body: JSON.stringify({
                        name: bodyArr[0],
                        description: bodyArr[3],
                        tracks: bodyArr[1],
                        flag: bodyArr[2],
                        dateModified: today
                    })
                })
                .then(res => {
                    if (res.ok) {
                        res.json()
                        .catch(err => console.log('Failed to get json object at second'))
                        showLists();
                    }
                    else {
                        alert(res.statusText);
                    }
                })
                .catch()
            }
            else {
                alert(res.statusText);
                return false;
            }
        })
        .catch()
    }
}

const showListsBtn = document.getElementById('show-lists');
if (showListsBtn) {
    showListsBtn.addEventListener('click', showLists);
}

function showLists() {
    const mainList = document.getElementById('lists');

    if (mainList.childElementCount > 0) {
        var first = mainList.firstElementChild;
        while (first) {
            first.remove();
            first = mainList.lastElementChild;
        }
    }

    fetch('/api/secure/allLists')
    .then(res => res.json())
    .then(data => {
        data.forEach(list => {
            const item = document.createElement('li');

            item.appendChild(document.createTextNode(`
            Name: ${list['name']},
            Flag: ${list['flag']}
            `));

            mainList.appendChild(item);

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';

            const editBtn = document.createElement('button');
            editBtn.textContent = 'Edit';

            const reviewBtn = document.createElement('button');
            reviewBtn.textContent = 'Add review';

            const editDiv = document.createElement('div');
            editDiv.appendChild(editBtn);
            editDiv.appendChild(deleteBtn);

            if (list['flag'] == 'public') {
                editDiv.appendChild(reviewBtn);
            }

            mainList.appendChild(editDiv);

            const childItem = document.createElement('h5');
            const childItem2 = document.createElement('h5');

            if (item.childElementCount > 0) {
                let first = item.firstElementChild;
                while (first) {
                    first.remove();
                    first = item.lastElementChild;
                }
            }

            childItem.appendChild(document.createTextNode(`
                Description: ${list['description']},
                Tracks: ${list['tracks']}
            `))

            if (list['review'] !== undefined) {
                childItem2.appendChild(document.createTextNode(`
                    Rating: ${list['review']['rating']}/10,
                    Comment: ${list['review']['comment']},
                    Review created: ${list['review']['creationDate']}
                `));
            }

            item.appendChild(childItem);
            item.appendChild(childItem2);

            childItem.style.display = 'none';
            childItem2.style.display = 'none';

            item.addEventListener('click', showChildItems);
            
            function showChildItems() {
                childItem.style.display = 'block';
                childItem2.style.display = 'block';
            }

            editBtn.addEventListener('click', function(){
                let nameInput = document.createElement('input');
                nameInput.placeholder = 'Enter new name';
                nameInput.id = 'get-new-name';

                let descriptionInput = document.createElement('input');
                descriptionInput.placeholder = 'Enter new description';
                descriptionInput.id = 'get-new-description';

                let addTracksInput = document.createElement('input');
                addTracksInput.placeholder = 'Add tracks';
                addTracksInput.id = 'get-new-tracks';
                addTracksInput.type = 'number';

                let removeTracksInput = document.createElement('input');
                removeTracksInput.placeholder = 'Remove tracks';
                removeTracksInput.id = 'get-removed-tracks';
                removeTracksInput.type = 'number';

                let flagInput = document.createElement('input');
                flagInput.placeholder = 'Enter new flag';         
                flagInput.id = 'get-new-flag';

                const saveBtn = document.createElement('button');
                saveBtn.textContent = 'Save';

                const cancelBtn = document.createElement('button');
                cancelBtn.textContent = 'Cancel';

                const placeDiv = document.createElement('div');
                placeDiv.appendChild(nameInput);
                placeDiv.appendChild(descriptionInput);
                placeDiv.appendChild(addTracksInput);
                placeDiv.appendChild(removeTracksInput);
                placeDiv.appendChild(flagInput);
                placeDiv.appendChild(saveBtn);
                placeDiv.appendChild(cancelBtn);

                editDiv.insertBefore(placeDiv, editBtn);
                editBtn.style.display = 'none';
                deleteBtn.style.display = 'none';
                reviewBtn.style.display = 'none';

                cancelBtn.addEventListener('click', function(){
                    showLists();
                })

                saveBtn.addEventListener('click', function(){
                    let getName = document.getElementById('get-new-name').value.toLowerCase();
                    let getDescription = document.getElementById('get-new-description').value.toLowerCase();
                    let getTrack = document.getElementById('get-new-tracks').value;
                    let getRemovedTrack = document.getElementById('get-removed-tracks').value;
                    let getFlag = document.getElementById('get-new-flag').value.toLowerCase();
                    
                    function validateEditedList(name, description, newTrack, removedTrack, flag) {
                        let tracks = `${list['tracks']}`;
                        if ((name == null || name == '') && (description == null || description == '') && (newTrack == null || newTrack == '') && (removedTrack == null || removedTrack == '') && (flag == null || flag == '')) {
                            alert('Enter at least one item to be changed or press cancel');
                            return false;
                        }

                        if (name == null || name == '') {
                            name = `${list['name']}`;
                        }

                        if (description == null || description == '') {
                            description = `${list['description']}`;
                        }

                        if (newTrack == null || newTrack == '') {}
                        else {
                            fetch(`/api/tracks/${newTrack}`)
                                .then(res => {
                                    if (res.ok) {
                                        res.json()
                                        .catch(err => console.log('Failed to get json object at third'))
                                    }
                                    else {
                                        alert(res.statusText);
                                        return false;
                                    }
                                })
                                .catch()
                        }

                        if (flag == null || flag == '') {
                            flag = 'private';
                        }

                        if ((flag == 'private') || (flag == 'public')) {}
                         else {
                             alert('Flag can only be "public" or "private"');
                             return false;
                        }

                        let arr = [name, description, tracks, flag];

                        return (arr);
                    }
                    
                    const newArr = validateEditedList(getName, getDescription, getTrack, getRemovedTrack, getFlag);

                    if (newArr == false) {}
                    else {
                        fetch('api/secure/edit', {
                            method: 'PUT',
                            headers: {'Content-type': 'application/json'},
                            body: JSON.stringify({
                                replaceName: `${list['name']}`,
                                name: newArr[0],
                                description: newArr[1],
                                track: newArr[2],
                                flag: newArr[3]
                            })
                        })
                        .then(res => {
                            if (res.ok) {
                                res.json()
                                .catch(err => console.log('Failed to get json object at fourth'))
                                showLists();
                            }
                            else {
                                alert(res.statusText);
                            }
                        })
                        .catch()
                    }
                })
            })

            deleteBtn.addEventListener('click', function(){
                let confirmDelete = confirm('Are you sure you wish to delete this playlist?');
                if (confirmDelete) {
                    fetch(`api/secure/delete/${list['name']}`, {
                        method: 'DELETE'
                    })

                    setTimeout(showMyLists, 500);

                    function showMyLists() {
                        showLists();
                    }
                }
            })

            reviewBtn.addEventListener('click', function(){

                const ratingInput = document.createElement('input');
                ratingInput.placeholder = 'Enter rating out of 10';
                ratingInput.type = 'number';
                ratingInput.id = 'ratingInput';

                const commentInput = document.createElement('input');
                commentInput.placeholder = 'Enter comment';
                commentInput.id = 'commentInput';

                const okBtn = document.createElement('button');
                okBtn.textContent = 'OK';

                const cancelBtn = document.createElement('button');
                cancelBtn.textContent = 'Cancel';

                const reviewDiv = document.createElement('div');

                reviewDiv.appendChild(ratingInput);
                reviewDiv.appendChild(commentInput);
                reviewDiv.appendChild(okBtn);
                reviewDiv.appendChild(cancelBtn);

                reviewBtn.style.display = 'none';
                editBtn.style.display = 'none';
                deleteBtn.style.display = 'none';

                editDiv.appendChild(reviewDiv);

                okBtn.addEventListener('click', function(){
                    const getRating = document.getElementById('ratingInput').value.toLowerCase();
                    const getComment = document.getElementById('commentInput').value.toLowerCase();

                    if (getRating < 0 || getRating > 10) {
                        alert('Please enter a rating between 1 and 10');
                        return false;
                    }
                    if (getRating == null || getRating == '') {
                        alert('Please enter a rating');
                        return false;
                    }
                    else if (getComment == null || getComment == '') {
                        alert('Please enter a comment');
                        return false;
                    }

                    let today = new Date();
                    let dd = String(today.getDate()).padStart(2, '0');
                    let mm = String(today.getMonth() + 1).padStart(2, '0');
                    let yyyy = today.getFullYear();
                    today = mm + '/' + dd + '/' + yyyy;

                    fetch('/api/secure/list/review', {
                        method: 'POST',
                        headers: {'Content-type': 'application/json'},
                        body: JSON.stringify({
                            rating: getRating,
                            comment: getComment,
                            name: `${list['name']}`,
                            creationDate: today
                        })
                    })
                    .then(res => {
                        if (res.ok) {
                            res.json()
                            .catch(err => console.log('Failed to get json object at fifth'))
                            
                            showLists();
                        }
                        else {
                            alert(res.statusText);
                        }
                    })
                    .catch()
                })

                cancelBtn.addEventListener('click', function(){
                    showLists();
                })

             
                username = document.getElementById('username').value;
                password = document.getElementById('password').value;
                email = document.getElementById('email').value;
                loginBtn = document.getElementById('login');
                registerBtn = document.getElementById('register');
                //add event listener to the login button
                //when clicked, send a POST request to the server with the username and password
                loginBtn.addEventListener('click', function(){
                    fetch('/api/login', {
                        method: 'POST',
                        headers: {'Content-type': 'application/json'},
                        body: JSON.stringify({
                            email: email,
                            username: username,
                            password: password
                        })
                    })
                    .then(res => {
                        if (res.ok) {
                            res.json()
                            .catch(err => console.log('Failed to get json object at sixth'))
                            window.location.reload();
                        }
                        else {
                            alert(res.statusText);
                        }
                    })
                    .catch()
                })
                registerBtn.addEventListener('click', function(){
                    fetch('/api/register', {
                        method: 'POST',
                        headers: {'Content-type': 'application/json'},
                        body: JSON.stringify({
                            email: email,
                            username: username,
                            password: password
                        })
                    })
                    .then(res => {
                        if (res.ok) {
                            res.json()
                            .catch(err => console.log('Failed to get json object at seventh'))
                            window.location.reload();
                        }
                        else {
                            alert(res.statusText);
                        }
                    })
                    .catch()
                })


            })
        })
    })
}

// create a div containing message to click link and the link itself, return array containing message and link
function verifyEmail() {
    const linkDiv = document.createElement('div');

    const a = document.createElement('a'); 
    const link = document.createTextNode('Verify email');
    a.appendChild(link); 
    a.title = 'Verify email'; 

    const linkText = document.createElement('h5');
    linkText.style.marginLeft = '0px';
    linkText.textContent = 'Click the link below to verify your email';
    
    linkDiv.appendChild(linkText);
    linkDiv.appendChild(a);

    return [linkDiv, a];
}

// open the clicked link in a new tab
function openInNewTab(event) {
    window.open('http://localhost:3000/verifyLogin.html', '_blank').focus();

    // use currentTarget.<something> to directly get value for passed in event
    event.currentTarget.outerDiv.removeChild(event.currentTarget.innerDiv);

    fetch('/users/login/verify', {
        method: 'POST',
        headers: {'Content-type': 'application/json'},
        body: JSON.stringify({
            email: event.currentTarget.email,
            password: document.getElementById('get-new-email').value,
            emailVerified: 'y',
            accountStatus: 'active'
        })
    })
    .then(res => {
        if (res.ok) {}

        else {
            alert(res.statusText);
            return false;
        }
    })
  }

// email and password validation for null values
function validateLoginDetails(email, password) {
    if (email == '' || email == null) {
        alert('Email is required');
        return false;
    }

    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
        alert('Email is not in valid format, please enter correct form');
        return false;
    }

    if (password == '' || password == null){
        alert('Password is required');
        return false;
    }
    return true;
}
const searchBtn = document.getElementById('search-tracks-button');
if (searchBtn) {
    searchBtn.addEventListener('click', searchTracks);
}

function validateTrackSearchInput(aName, bName, gName, tName) {
    if ((aName == '' || aName == null) && (bName == '' || bName == null) && (gName == '' || gName == null) && (tName == '' || tName == null)) {
        return false;
    }
    else {
        return true
    }
}

function searchTracks() {
    const artistName = document.getElementById('get-artist-name').value.toLowerCase();
    const bandName = document.getElementById('get-band-name').value.toLowerCase();
    const genreName = document.getElementById('get-genre-name').value.toLowerCase();
    const trackTitle = document.getElementById('get-track-title').value.toLowerCase();

    if (validateTrackSearchInput(artistName, bandName, genreName, trackTitle)) {
        const list = document.getElementById('get-track-search');
        if (list.childElementCount > 0) {
            let first = list.firstElementChild;
            while (first) {
                first.remove();
                first = list.lastElementChild;
            }
        }

        fetch('/api/open/search/track', {
            method: 'POST',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({
                artistName: artistName,
                bandName: bandName,
                genreName: genreName,
                trackTitle: trackTitle
            })
        })
        .then(res => res.json())
        .then(data => {
            if (data.length == 0) {
                alert('No results were found matching the search input');
                return false;
            }
            else {
                data.forEach(row => {
                    const item = document.createElement('li');
                    const childItem = document.createElement('label');
                    childItem.appendChild(document.createTextNode(`
                    track_title: ${row['track_title']},
                    artist_name: ${row['artist_name']}
                    `))

                    const youtubeBtn = document.createElement('button');
                    youtubeBtn.textContent = 'Play on YouTube';
                    item.appendChild(childItem);
                    const br = document.createElement('br');
                    item.appendChild(youtubeBtn);
                    list.appendChild(item);

                    youtubeBtn.addEventListener('click', openYoutube);

                    function openYoutube() {
                        window.open(`https://www.youtube.com/results?search_query=${row['track_title']}+${row['artist_name']}`, '_blank').focus();
                    }

                    childItem.addEventListener('click', viewTrackInfo);

                    const infoDiv = document.createElement('div');
                    function viewTrackInfo() {
                        const infoLabel = document.createElement('h5');

                        infoLabel.appendChild(document.createTextNode(`
                            track_duration: ${row['track_duration']},
                            track_date_recorded: ${row['track_date_recorded']}
                        `));

                        if (infoDiv.childElementCount > 0) {
                            let first = infoDiv.firstElementChild;
                            while (first) {
                                first.remove();
                                first = infoDiv.lastElementChild;
                            }
                        }

                        infoDiv.appendChild(infoLabel);
                        item.appendChild(infoDiv);
                    }
                })
            }
        })
        .catch((error) => {
            console.log(error);
        })
    }
    else {
        alert('Please fill out a search field');
        return false;
    }
}
const publicLists = document.getElementsByTagName('public-playlists');
fetch('/api/open/publicLists')
.then(res => res.json())
.then(data => {
    let count = 0;
    data.forEach(list => {
        if (count < 10) {
            const ol = document.getElementById('public-playlists-list');
            const childItem = document.createElement('label');
            childItem.appendChild(document.createTextNode(`
                name: ${list['name']},
                numOfTracks: ${list['numOfTracks']},
                playTime: ${list['playTime']},
                averageRating: ${list['averageRating']}
            `))
            const br = document.createElement('br');
            ol.appendChild(childItem);
            ol.appendChild(br);

            childItem.addEventListener('click', expandPublicList);

            const h5Div = document.createElement('div');
            function expandPublicList() {
                const h5 = document.createElement('h5');
                if (h5Div.childElementCount > 0) {
                    let first = h5Div.firstElementChild;
                    while (first) {
                        first.remove();
                        first = h5Div.lastElementChild;
                    }
                }
                const trackLabel = document.createElement('label');
                trackLabel.textContent = `${list['tracks']}`;

                h5.appendChild(document.createTextNode(`
                    description: ${list['description']},
                    tracks: ${trackLabel.textContent},
                    dateModified: ${list['dateModified']}
                `))

                trackLabel.addEventListener('click', showTrackInfo);

                function showTrackInfo() {
                    console.log('showTrackInfo working');
                }
                
                const okBtn = document.createElement('button');
                okBtn.textContent = 'OK';
                h5Div.appendChild(h5);
                childItem.appendChild(h5Div);

            }
        }
        count += 1;
    })
})

const showCreateBtn = document.getElementById('show-create-button');
if (showCreateBtn) {
    showCreateBtn.addEventListener('click', createAccount);
}

// show email and password input fields and add event listener for create account button
function createAccount() {
    const newAccountDiv = document.getElementById('create-account');

    const emailLabel = document.createElement('label');
    emailLabel.textContent = 'Email: ';
    const emailInput = document.createElement('input');
    emailInput.placeholder = 'Enter email';
    emailInput.id = 'get-new-email';

    const passwordLabel = document.createElement('label');
    passwordLabel.textContent = 'Password: ';
    const passwordInput = document.createElement('input');
    passwordInput.placeholder = 'Enter password';
    passwordInput.id = 'get-new-password';

    emailInput.style.display = 'inline-block';
    passwordInput.style.display = 'inline-block';
    newAccountDiv.appendChild(emailLabel);
    newAccountDiv.appendChild(emailInput);
    newAccountDiv.appendChild(document.createElement('br'));
    newAccountDiv.appendChild(passwordLabel);
    newAccountDiv.appendChild(passwordInput);
    newAccountDiv.appendChild(document.createElement('br'));

    const createBtn = document.createElement('button');
    createBtn.textContent = 'Create'

    newAccountDiv.appendChild(createBtn);

    createBtn.addEventListener('click', validateLogin);

    // add values inside body to firebase database, set values to be referenced using event.currentTarget
    function validateLogin() {
        if (validateLoginDetails(emailInput.value, passwordInput.value)) {
            fetch('/users',  {
                method: 'POST',
                headers: {'Content-type': 'application/json'},
                body: JSON.stringify({
                    email: emailInput.value,
                    password: passwordInput.value,
                    emailVerified: 'n',
                    accountStatus: 'active'
                })
            })
            .then(res => {
                if (res.ok) {
                    const linkArr = verifyEmail();
                    newAccountDiv.appendChild(linkArr[0]);

                    linkArr[1].addEventListener('click', openInNewTab, false);

                    // this is used for event.currentTarget
                    linkArr[1].outerDiv = newAccountDiv;
                    linkArr[1].innerDiv = linkArr[0];
                    linkArr[1].email = emailInput.value;
                    linkArr[1].password = passwordInput.value;
                }
                else {
                    alert(res.statusText);
                    return false;
                }
            })
        }
    }

}

const loginBtn = document.getElementById('submit-user-login');
if (loginBtn) {
    loginBtn.addEventListener('click', checkLogin);
}

function showAuthenticatedPage() {
    loginPage.style.display = 'none';
    authenticatedDiv.style.display = 'block';
}

// check all below conditions when user tries to log in
function checkLogin() {
    const email = document.getElementById('get-email').value;
    const password = document.getElementById('get-password').value;

    // check for null values
    if (validateLoginDetails(email, password)) {
        fetch('/users/login', {
            method: 'POST',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({
                email: email,
                password: password
            })
        })
        .then(res => {
            // if email is verified, account is not deactivated, password is correct, then run
            if (res.ok) {
                showAuthenticatedPage();
                const message = document.createElement('h5');
                message.textContent = 'Successfully logged in!';

                const list = document.getElementById('update-password-list');
                const updateBtn = document.createElement('button');
                updateBtn.textContent = 'Update password';

                const deactivateBtn = document.createElement('button');
                deactivateBtn.textContent = 'Deactive account';

                const logOutBtn = document.createElement('button');
                logOutBtn.textContent = 'Log out';

                const grantAdminBtn = document.createElement('button');
                grantAdminBtn.textContent = 'Grant admin';

                const revokeAdminBtn = document.createElement('button');
                revokeAdminBtn.textContent = 'Revoke admin';

                const banUserBtn = document.createElement('button');
                banUserBtn.textContent = 'Ban user';

                const unbanUserBtn = document.createElement('button');
                unbanUserBtn.textContent = 'Unban user';

                const br = document.createElement('br');

                // show logged in message, update and deactivate buttons
                list.appendChild(message);
                list.appendChild(updateBtn);
                list.appendChild(deactivateBtn);
                list.appendChild(logOutBtn);

                logOutBtn.addEventListener('click', logOut);

                function logOut() {
                    window.location.reload();
                }

                deactivateBtn.addEventListener('click', deactivateAccount);

                // set accountStatus in firebase database to deactivated so user cannot log in
                function deactivateAccount() {
                    fetch('/users/login/deactivate', {
                        method: 'POST',
                        headers: {'Content-type': 'application/json'},
                        body: JSON.stringify({
                            email: email,
                            password: password,
                            emailVerified: 'y',
                            accountStatus: 'deactivated'
                        })
                    })
                    .then(res => {
                        if (res.ok) {
                            window.location.reload();
                        }
                        else {
                            alert(res.statusText)
                            return false;
                        }
                    })
                    .catch()
                }

                updateBtn.addEventListener('click', updatePassword);

                // enter new password and store hashed password in firebase database
                function updatePassword() {
                    const okBtn = document.createElement('button');
                    okBtn.textContent = 'OK';
                    const cancelBtn = document.createElement('button');
                    cancelBtn.textContent = 'Cancel';

                    const passwordLabel = document.createElement('label');
                    passwordLabel.textContent = 'Enter new password: '
                    const passwordInput = document.createElement('input');
                    passwordInput.placeholder = 'Enter password';

                    const br = document.createElement('br');
                    
                    // show message and button for new password

                    const newPasswordDiv = document.createElement('div');

                    newPasswordDiv.appendChild(passwordLabel);
                    newPasswordDiv.appendChild(passwordInput);
                    newPasswordDiv.appendChild(okBtn);
                    newPasswordDiv.appendChild(cancelBtn);
                    list.appendChild(newPasswordDiv);

                    okBtn.addEventListener('click', changePassword);
                    cancelBtn.addEventListener('click', cancelPasswordUpdate);

                    // if ok button is clicked, update new password in database
                    function changePassword() {
                        if (passwordInput.value == '' || passwordInput.value == null) {
                            alert('Password is required');
                            return false;
                        }

                        fetch('/users/login/password/update', {
                            method: 'POST',
                            headers: {'Content-type': 'application/json'},
                            body: JSON.stringify({
                                email: email,
                                password: passwordInput.value
                            })
                        })
                        .then(res => {
                            if (res.ok) {
                                window.location.reload();
                            }
                            else {
                                alert(res.statusText);
                            }
                        })
                        .catch()
                    }

                    // reload window if cancel button is clicked
                    function cancelPasswordUpdate() {
                        newPasswordDiv.style.display = 'none';
                    }
                }
            }

            // any condiiton was not true then show error
            else {
                alert(res.statusText);

                // only show verify link if email has not been verified
                if (res.statusText == 'Please verify email and try again') {
                    const outerLinkDiv = document.getElementById('login-div');

                    // const linkArr = verifyEmail()
                    // outerLinkDiv.appendChild(linkArr[0]);
                    // linkArr[1].addEventListener('click', openInNewTab, false);
                    
                    // linkArr[1].outerDiv = outerLinkDiv;
                    // linkArr[1].innerDiv = linkArr[0];
                    // linkArr[1].email = email;
                    // linkArr[1].password = password;
                }

                return false;
            }
        })
        .catch()
    }
}

const showUsersBtn = document.getElementById('show-users');
if (showUsersBtn) {
    showUsersBtn.addEventListener('click', showUsers);
}

// not included in final site, just to see the list of users
function showUsers() {
    fetch('/users')
    .then(res => res.json())
    .then(data => {
        const list = document.getElementById('users-ordered-list');

        if (list.childElementCount > 0) {
            let first = list.firstElementChild;
            while (first) {
                first.remove();
                first = list.lastElementChild;
            }
        }
        data.forEach(user => {
            const item = document.createElement('li');
            item.appendChild(document.createTextNode(`
                Email: ${user['email']},
                Password: ${user['password']}
            `))
            list.appendChild(item);
        })
    })
}
//ADMIN PRIVILEGES
//special user with admin privileges
const admin = {
    email: 'admin',
    password: 'admin'
}
//ability to grant admin privileges to other users
const grantAdminBtn = document.getElementById('grant-admin');
if (grantAdminBtn) {
    grantAdminBtn.addEventListener('click', grantAdmin);
}

function grantAdmin() {
    const email = document.getElementById('get-email').value;
    const password = document.getElementById('get-password').value;

    if (validateLoginDetails(email, password)) {
        fetch('/users/login', {
            method: 'POST',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({
                email: email,
                password: password
            })
        })
        .then(res => {
            if (res.ok) {
                fetch('/users/admin', {
                    method: 'POST',
                    headers: {'Content-type': 'application/json'},
                    body: JSON.stringify({
                        email: email,
                        password: password,
                        admin: 'y'
                    })
                })
                .then(res => {
                    if (res.ok) {
                        window.location.reload();
                    }
                    else {
                        alert(res.statusText);
                    }
                })
                .catch()
            }
            else {
                alert(res.statusText);
                return false;
            }
        })
        .catch()
    }
}

// ability to revoke admin privileges from other users
const revokeAdminBtn = document.getElementById('revoke-admin');
if (revokeAdminBtn) {
    revokeAdminBtn.addEventListener('click', revokeAdmin);
}

function revokeAdmin() {
    const email = document.getElementById('get-email').value;
    const password = document.getElementById('get-password').value;

    if (validateLoginDetails(email, password)) {
        fetch('/users/login', {
            method: 'POST',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({
                email: email,
                password: password
            })
        })
        .then(res => {
            if (res.ok) {
                fetch('/users/admin', {
                    method: 'POST',
                    headers: {'Content-type': 'application/json'},
                    body: JSON.stringify({
                        email: email,
                        password: password,
                        admin: 'n'
                    })
                })
                .then(res => {
                    if (res.ok) {
                        window.location.reload();
                    }
                    else {
                        alert(res.statusText);
                    }
                })
                .catch()
            }
            else {
                alert(res.statusText);
                return false;
            }
        })
        .catch()
    }
}

//Ability to mark a review as hidden 
const hideReviewBtn = document.getElementById('hide-review');
if (hideReviewBtn) {
    hideReviewBtn.addEventListener('click', hideReview);
}

function hideReview() {
    const reviewId = document.getElementById('get-review-id').value;

    if (reviewId == '' || reviewId == null) {
        alert('Review ID is required');
        return false;
    }

    fetch('/reviews/hide', {
        method: 'POST',
        headers: {'Content-type': 'application/json'},
        body: JSON.stringify({
            reviewId: reviewId
        })
    })
    .then(res => {
        if (res.ok) {
            window.location.reload();
        }
        else {
            alert(res.statusText);
        }
    })
    .catch()
}
//mark a review as unhidden
const unhideReviewBtn = document.getElementById('unhide-review');
if (unhideReviewBtn) {
    unhideReviewBtn.addEventListener('click', unhideReview);
}

function unhideReview() {
    const reviewId = document.getElementById('get-review-id').value;

    if (reviewId == '' || reviewId == null) {
        alert('Review ID is required');
        return false;
    }

    fetch('/reviews/unhide', {
        method: 'POST',
        headers: {'Content-type': 'application/json'},
        body: JSON.stringify({
            reviewId: reviewId
        })
    })
    .then(res => {
        if (res.ok) {
            window.location.reload();
        }
        else {
            alert(res.statusText);
        }
    })
    .catch()
}
//ability to mark a user as banned
const banUserBtn = document.getElementById('ban-user');
if (banUserBtn) {
    banUserBtn.addEventListener('click', banUser);
}

function banUser() {
    const email = document.getElementById('get-email').value;
    const password = document.getElementById('get-password').value;

    if (validateLoginDetails(email, password)) {
        fetch('/users/login', {
            method: 'POST',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({
                email: email,
                password: password
            })
        })
        .then(res => {
            if (res.ok) {
                fetch('/users/ban', {
                    method: 'POST',
                    headers: {'Content-type': 'application/json'},
                    body: JSON.stringify({
                        email: email,
                        password: password,
                        banned: 'y'
                    })
                })
                .then(res => {
                    if (res.ok) {
                        window.location.reload();
                    }
                    else {
                        alert(res.statusText);
                    }
                })
                .catch()
            }
            else {
                alert(res.statusText);
                return false;
            }
        })
        .catch()
    }
}
//ability to mark a user as unbanned
const unbanUserBtn = document.getElementById('unban-user');
if (unbanUserBtn) {
    unbanUserBtn.addEventListener('click', unbanUser);
}

function unbanUser() {
    const email = document.getElementById('get-email').value;
    const password = document.getElementById('get-password').value;

    if (validateLoginDetails(email, password)) {
        fetch('/users/login', {
            method: 'POST',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({
                email: email,
                password: password
            })
        })
        .then(res => {
            if (res.ok) {
                fetch('/users/ban', {
                    method: 'POST',
                    headers: {'Content-type': 'application/json'},
                    body: JSON.stringify({
                        email: email,
                        password: password,
                        banned: 'n'
                    })
                })
                .then(res => {
                    if (res.ok) {
                        window.location.reload();
                    }
                    else {
                        alert(res.statusText);
                    }
                })
                .catch()
            }
            else {
                alert(res.statusText);
                return false;
            }
        })
        .catch()
    }
}






