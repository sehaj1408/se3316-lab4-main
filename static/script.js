const authenticatedDiv = document.getElementById('authenticated-user-div');
if (authenticatedDiv) {
    authenticatedDiv.style.display = 'none';
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
    window.location.reload();
  }

// email and password validation for null values
function validateLoginDetails(email, password) {
    if (email == '' || email == null) {
        alert('Email is required');
        return false;
    }

    if (password == '' || password == null){
        alert('Password is required');
        return false;
    }
    return true;
}

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
loginBtn.addEventListener('click', checkLogin);

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
                const message = document.createElement('h5');
                message.textContent = 'Successfully logged in!';

                const list = document.getElementById('update-password-list');
                const updateBtn = document.createElement('button');
                updateBtn.textContent = 'Update password';

                const deactivateBtn = document.createElement('button');
                deactivateBtn.textContent = 'Deactive account';

                const br = document.createElement('br');

                // show logged in message, update and deactivate buttons
                list.appendChild(message);
                list.appendChild(updateBtn);
                list.appendChild(deactivateBtn);

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
                    list.appendChild(br);
                    list.appendChild(passwordLabel);
                    list.appendChild(passwordInput);
                    list.appendChild(okBtn);
                    list.appendChild(cancelBtn);

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
                                console.log(passwordInput.value);
                            }
                            else {
                                alert(res.statusText);
                            }
                        })
                        .catch()
                    }

                    // reload window if cancel button is clicked
                    function cancelPasswordUpdate() {
                        window.location.reload();
                    }
                }
            }

            // any condiiton was not true then show error
            else {
                alert(res.statusText);

                // only show verify link if email has not been verified
                if (res.statusText == 'Please verify email and try again') {
                    const outerLinkDiv = document.getElementById('login-div');

                    const linkArr = verifyEmail()
                    outerLinkDiv.appendChild(linkArr[0]);
                    linkArr[1].addEventListener('click', openInNewTab, false);
                    
                    linkArr[1].outerDiv = outerLinkDiv;
                    linkArr[1].innerDiv = linkArr[0];
                    linkArr[1].email = email;
                    linkArr[1].password = password;
                }

                return false;
            }
        })
        .catch()
    }
}

const showUsersBtn = document.getElementById('show-users');
showUsersBtn.addEventListener('click', showUsers);

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
            console.log(user);
            const item = document.createElement('li');
            item.appendChild(document.createTextNode(`
                Email: ${user['email']},
                Password: ${user['password']}
            `))
            list.appendChild(item);
        })
    })
}