// common.js
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    //if (parts.length === 2) return parts.pop().split(';').shift();
    if (parts.length === 2) {
        const cookieValue = parts.pop().split(';').shift();
        console.log(`Cookie found: ${name}=${cookieValue}`);
        return cookieValue;
    }
    console.log(`Cookie not found: ${name}`);
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
    console.log("checkLoginStatus function called");
    const username = getCookie('username');
    if (username) {
        const loginButton = document.getElementById('loggedin');
        if (loginButton) {
            console.log(`Changing login button text to: ${username}`);
            loginButton.textContent = username;  // Changed from loginButton.value to loginButton.textContent
        } else {
            console.log("Login button element not found");
        }
    } else {
        console.log("Username cookie not found");
    }
}

document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM fully loaded and parsed");
    checkLoginStatus();
});