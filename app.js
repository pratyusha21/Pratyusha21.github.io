document.addEventListener('DOMContentLoaded', function() {
    const userForm = document.getElementById('userForm');
    const nameInput = document.getElementById('name');
    const skillsInput = document.getElementById('skills');
    const usersList = document.getElementById('users');
    let usersData = [];

    userForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const name = nameInput.value.trim();
        const skills = skillsInput.value.split(',').map(skill => skill.trim());
        usersData.push({ name, skills });
        displayUsers();
        userForm.reset();
    });

    function displayUsers() {
        usersList.innerHTML = '';
        usersData.forEach(user => {
            const userElement = document.createElement('li');
            userElement.textContent = `${user.name}: ${user.skills.join(', ')}`;
            usersList.appendChild(userElement);
        });
    }

    skillsInput.addEventListener('input', function(e) {
        const inputText = e.target.value;
        const lastComma = inputText.lastIndexOf(',');
        const currentEntry = inputText.substring(lastComma + 1).trim();

        if (!currentEntry) return;

        const suggestions = getSuggestions(currentEntry);
        console.log(suggestions); // You can use these suggestions to show a dropdown of suggested skills
    });

    function getSuggestions(input) {
        const allSkills = usersData.flatMap(user => user.skills);
        return allSkills.filter(skill => skill.toLowerCase().startsWith(input.toLowerCase()));
    }
});
