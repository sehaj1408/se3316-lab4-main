const addListBtn = document.getElementById('create-list');
addListBtn.addEventListener('click', createList);

function validatenewListInput(name, tracks, flag, description) {
    if (name == null || name == "") {
        alert('Name is required');
        return false;
    }
    else if (tracks == null || tracks == "") {
        alert('Tracks are required');
        return false;
    }

    let reg = /[^0-9\,]+/;
    if (reg.test(tracks)) {
        alert('Tracks field can only include numbers and commas');
        return false;
    }

    if (flag == null || flag == '') {
        flag = 'private';
    }

    if (description == null || description == '') {
        description = 'no description'
    }

    if ((flag == 'private') || (flag == 'public')) {
       // fine 
    }
    else {
        alert('Flag can only be "public" or "private"');
        return false;
    }

    let arr = [name, tracks, flag, description];

    return (arr);
}

function createList() {
    let name = document.getElementById('get-list-name').value.toLowerCase();
    let description = document.getElementById('get-list-description').value.toLowerCase();
    let tracks = document.getElementById('get-list-tracks').value.toLowerCase();
    let flag = document.getElementById('get-list-flag').value.toLowerCase();

    const bodyArr = validatenewListInput(name, tracks, flag, description);

    fetch('/api/secure/list', {
        method: 'POST',
        headers: {'Content-type': 'application/json'},
        body: JSON.stringify({
            name: bodyArr[0],
            description: bodyArr[3],
            tracks: bodyArr[1],
            flag: bodyArr[2]
        })
    })
    .then(res => {
        if (res.ok) {
            res.json()
            .catch(err => console.log('Failed to get json object'))
            showLists();
        }
        else {
            alert(res.statusText);
        }
    })
    .catch()
}

const showListsBtn = document.getElementById('show-lists');
showListsBtn.addEventListener('click', showLists);

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
                    Comment: ${list['review']['comment']}
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

                let tracksInput = document.createElement('input');
                tracksInput.placeholder = 'Enter new tracks';
                tracksInput.id = 'get-new-tracks';

                let flagInput = document.createElement('input');
                flagInput.placeholder = 'Enter new flag';         
                flagInput.id = 'get-new-flag';

                const saveBtn = document.createElement('button');
                saveBtn.textContent = 'Save';

                const placeDiv = document.createElement('div');
                placeDiv.appendChild(nameInput);
                placeDiv.appendChild(descriptionInput);
                placeDiv.appendChild(tracksInput);
                placeDiv.appendChild(flagInput);
                placeDiv.appendChild(saveBtn);

                editDiv.insertBefore(placeDiv, editBtn);
                editBtn.style.display = 'none';
                deleteBtn.style.display = 'none';
                reviewBtn.style.display = 'none';

                saveBtn.addEventListener('click', function(){
                    let getName = document.getElementById('get-new-name').value.toLowerCase();
                    let getDescription = document.getElementById('get-new-description').value.toLowerCase();
                    let getTracks = document.getElementById('get-new-tracks').value.toLowerCase();
                    let getFlag = document.getElementById('get-new-flag').value.toLowerCase();

                    const newArr = validatenewListInput(getName, getTracks, getFlag, getDescription);

                    if (newArr == false) {}
                    else {
                        fetch('api/secure/edit', {
                            method: 'PUT',
                            headers: {'Content-type': 'application/json'},
                            body: JSON.stringify({
                                replaceName: `${list['name']}`,
                                name: newArr[0],
                                description: newArr[3],
                                tracks: newArr[1],
                                flag: newArr[2]
                            })
                        })
                        .then(res => {
                            if (res.ok) {
                                res.json()
                                .catch(err => console.log('Failed to get json object'))
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

                    window.location.reload();
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

                reviewBtn.style.visibility = 'hidden';

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

                    fetch('/api/secure/list/review', {
                        method: 'POST',
                        headers: {'Content-type': 'application/json'},
                        body: JSON.stringify({
                            rating: getRating,
                            comment: getComment,
                            name: `${list['name']}`
                        })
                    })
                    .then(res => {
                        if (res.ok) {
                            res.json()
                            .catch(err => console.log('Failed to get json object'))
                            
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
                            .catch(err => console.log('Failed to get json object'))
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
                            .catch(err => console.log('Failed to get json object'))
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