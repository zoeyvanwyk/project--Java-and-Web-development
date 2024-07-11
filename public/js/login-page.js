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
            alert("You have successfully logged in.");
            location.reload();
        } else {
            loginErrorMsg.style.opacity = 1;
        }
    } catch (error) {
        console.error('Error during login:', error);
        loginErrorMsg.style.opacity = 1;
    }
});