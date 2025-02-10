const lengthSlider = document.getElementById('lengthSlider');
const lengthValue = document.getElementById('lengthValue');
const passwordDisplay = document.getElementById('passwordDisplay');

lengthSlider.addEventListener('input', (e) => {
    lengthValue.textContent = e.target.value;
});

function generatePassword() {
    const length = lengthSlider.value;
    const hasUpper = document.getElementById('uppercaseCheck').checked;
    const hasLower = document.getElementById('lowercaseCheck').checked;
    const hasNumbers = document.getElementById('numbersCheck').checked;
    const hasSymbols = document.getElementById('symbolsCheck').checked;

    const upperChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowerChars = 'abcdefghijklmnopqrstuvwxyz';
    const numberChars = '0123456789';
    const symbolChars = '!@#$%^&*';

    let chars = '';
    if (hasUpper) chars += upperChars;
    if (hasLower) chars += lowerChars;
    if (hasNumbers) chars += numberChars;
    if (hasSymbols) chars += symbolChars;

    if (chars === '') {
        alert('Please select at least one option!');
        return;
    }

    let password = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        password += chars[randomIndex];
    }

    passwordDisplay.textContent = password;
}

function copyPassword() {
    navigator.clipboard.writeText(passwordDisplay.textContent)
        .then(() => alert('Password copied!'))
        .catch(err => alert('Error copying: ' + err));
}
