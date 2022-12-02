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

            const editBtn = document.createElement('button');
            editBtn.textContent = 'Edit';

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';

            const reviewBtn = document.createElement('button');
            reviewBtn.textContent = 'Add review';

            const editDiv = document.createElement('div');

            item.appendChild(document.createTextNode(`
            Name: ${list['name']},
            Flag: ${list['flag']}
            `));

            mainList.appendChild(item);

            editDiv.appendChild(editBtn);
            editDiv.appendChild(deleteBtn);

            if (list['flag'] == 'public') {
                editDiv.appendChild(reviewBtn);
            }

            mainList.appendChild(editDiv);

            const childItem = document.createElement('h5');

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

            item.appendChild(childItem);

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
                        }
                        else {
                            alert(res.statusText);
                        }
                    })
                    .catch()
                })

                cancelBtn.addEventListener('click', function(){

                })
            })

            childItem.style.display = 'none';

            item.addEventListener('click', function(){
                childItem.style.display = 'block';
            })
        })
    })
}