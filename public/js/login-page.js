const loginForm = document.getElementById("login-form");
const loginButton = document.getElementById("login-form-submit");
const loginErrorMsg = document.getElementById("login-error-msg");

loginButton.addEventListener("click", async (e) => {
    e.preventDefault();
    const username = loginForm.username.value;
    const password = loginForm.password.value;

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });
        const result = await response.json();

        if (result.success) {
            document.cookie = `session_token=${result.sessionToken}; path=/`;
            document.cookie = `username=${username}; path=/`;
            window.location.href = '/'; 
        } else {
            loginErrorMsg.style.opacity = 1;
        }
    } catch (error) {
        console.error('Error during login:', error);
        loginErrorMsg.style.opacity = 1;
    }
});

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

function checkLoginStatus() {
    const username = getCookie('username');
    if (username) {
        const loginButton = document.getElementById('loggedin');
        loginButton.value = username;
        loginButton.disabled = true;
    }
}

document.addEventListener('DOMContentLoaded', checkLoginStatus);

