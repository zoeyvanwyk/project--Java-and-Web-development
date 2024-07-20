// common.js
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    // if (parts.length === 2) {
    //     const cookieValue = parts.pop().split(';').shift();
    //     console.log(`Cookie found: ${name}=${cookieValue}`);
    //     return cookieValue;
    // }
    // console.log(`Cookie not found: ${name}`);
}

// function checkLoginStatus() {
//     const username = getCookie('username');
//     if (username) {
//         const loginButton = document.getElementById('loggedin');
//         if (loginButton) {
//             // loginButton.innerText = username;
//             // loginButton.disabled = true;
//             loginButton.textContent = username;
//             loginButton.href = "#";
//         }
//     }
// }

// document.addEventListener('DOMContentLoaded', checkLoginStatus);
function checkLoginStatus() {
    const username = getCookie('username');
    const loginButton = document.getElementById('loggedin');
    const logoutButton = document.getElementById('logout-button');

    if (username) {
        loginButton.innerHTML = username;
        loginButton.href = "#";
        logoutButton.style.display = "block";
    } else {
        loginButton.innerHTML = "Log In";
        loginButton.href = "login-page.html";
        logoutButton.style.display = "none";
    }
}

document.addEventListener('DOMContentLoaded', checkLoginStatus);

document.getElementById('logout-button').addEventListener('click', async (event) => {
    event.preventDefault();
    try {
        const response = await fetch('/logout', { method: 'POST' });
        if (response.ok) {
            document.cookie = 'username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
            document.cookie = 'session_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
            window.location.href = 'login-page.html';
        }
    } catch (error) {
        console.error('Error logging out:', error);
    }
});