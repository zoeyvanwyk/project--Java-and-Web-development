// common.js
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

function checkLoginStatus() {
    const username = getCookie('username');
    if (username) {
        const loginButton = document.getElementById('loggedin');
        if (loginButton) {
            // loginButton.innerText = username;
            // loginButton.disabled = true;
            loginButton.textContent = username;
            loginButton.href = "#";
        }
    }
}

document.addEventListener('DOMContentLoaded', checkLoginStatus);


// function logout() {
//     document.cookie = 'session_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
//     document.cookie = 'username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
//     window.location.href = 'login-page.html';
// }

// document.addEventListener('DOMContentLoaded', () => {
//     const logoutButton = document.getElementById('logout');
//     if (logoutButton) {
//         logoutButton.addEventListener('click', logout);
//     }
// });