const signupForm = document.getElementById("signup-form");
const signupButton = document.getElementById("signup-form-submit");
const signupErrorMsg = document.getElementById("signup-error-msg");

signupButton.addEventListener("click", async (e) => {
    e.preventDefault();
    const username = signupForm.username.value;
    const password = signupForm.password.value;
    const email = signupForm.email.value;

    try {
        const response = await fetch('/sign-up', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password, email })
        });

        if (response.ok) {
            window.location.href = "index.html";
        } else {
            signupErrorMsg.style.opacity = 1;
        }
    } catch (error) {
        console.error('Error during sign-up:', error);
        signupErrorMsg.style.opacity = 1;
    }
});