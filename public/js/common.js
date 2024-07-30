// common.js
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

function checkLoginStatus() {
    const username = getCookie('username');
    const isAdmin = getCookie('is_admin') === 'true';
    const loginButton = document.getElementById('loggedin');
    const stockLink = document.getElementById('stock-link');
    const logoutButton = document.getElementById('logout-button');

    if (username) {
        loginButton.innerHTML = username;
        loginButton.href = "#";
        logoutButton.style.display = "block";
        if (isAdmin) {
            console.log('Admin user detected');
            if (stockLink) {
                stockLink.style.display = 'block';
            }
        }
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
            document.cookie = 'is_admin=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
            window.location.href = 'login-page.html';
        }
    } catch (error) {
        console.error('Error logging out:', error);
    }
});