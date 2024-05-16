// Firebase configuration
var firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID",
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Authentication functions
function registerUser() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            console.log('User created and signed in!');
            alert('User registration successful');
        })
        .catch((error) => {
            console.error('Error signing in with email and password', error.message);
            alert('Error: ' + error.message);
        });
}

function loginUser() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            console.log('User logged in');
            alert('Login successful');
        })
        .catch((error) => {
            console.error('Error logging in', error.message);
            alert('Error: ' + error.message);
        });
}

function googleSignIn() {
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider).then(function(result) {
        console.log('Success. The token is', result.credential.accessToken);
        var user = result.user;
        alert('Google sign-in successful');
    }).catch(function(error) {
        console.error('Error signing in with Google', error.message);
        alert('Error: ' + error.message);
    });
}

// Submit skills
function submitUserSkills() {
    const username = document.getElementById('username').value;
    const skillsInput = document.getElementById('skills').value;
    const skills = skillsInput.split(',').map(s => s.trim());

    db.collection('users').doc(username).set({skills})
        .then(() => {
            console.log('User skills updated!');
            fetchUsers();
            skills.forEach(skill => {
                addSkillIfNotExists(skill);
            });
        })
        .catch(error => {
            console.error('Error writing document: ', error);
        });
}

function addSkillIfNotExists(skill) {
    db.collection('skills').where('name', '==', skill).get()
        .then(querySnapshot => {
            if (querySnapshot.empty) {
                db.collection('skills').add({name: skill});
            }
        });
}

// Fetch and display users
function fetchUsers() {
    db.collection('users').get().then((querySnapshot) => {
        const usersList = document.getElementById('usersList');
        usersList.innerHTML = '';
        querySnapshot.forEach((doc) => {
            const user = doc.data();
            const li = document.createElement('li');
            li.textContent = doc.id + ': ' + user.skills.join(', ');
            usersList.appendChild(li);
        });
    });
}

// Show suggestions for skills
function showSuggestions(input) {
    if (input.length < 2) return; // Optionally, start suggestions after 2 characters.

    db.collection('skills').where('name', '>=', input)
        .get()
        .then(querySnapshot => {
            const suggestions = document.getElementById('suggestions');
            suggestions.innerHTML = ''; // Clear previous suggestions

            querySnapshot.forEach(doc => {
                const option = document.createElement('div');
                option.textContent = doc.data().name;
                option.onclick = function() {
                    const skillsInput = document.getElementById('skills');
                    skillsInput.value = doc.data().name; // Set the clicked suggestion
                    suggestions.innerHTML = ''; // Clear suggestions
                };
                suggestions.appendChild(option);
            });
        });
}
