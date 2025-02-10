// Password Generator Logic
function generatePassword() {
    const length = parseInt(document.getElementById('length').value);
    const hasUpper = document.getElementById('uppercase').checked;
    const hasLower = document.getElementById('lowercase').checked;
    const hasNumbers = document.getElementById('numbers').checked;
    const hasSymbols = document.getElementById('symbols').checked;

    const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lower = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    let chars = '';
    if (hasUpper) chars += upper;
    if (hasLower) chars += lower;
    if (hasNumbers) chars += numbers;
    if (hasSymbols) chars += symbols;

    if (!chars) {
        alert('Please select at least one character type!');
        return;
    }

    let password = '';
    for (let i = 0; i < length; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    document.getElementById('generated-password').value = password;
}

function copyPassword() {
    const passwordField = document.getElementById('generated-password');
    passwordField.select();
    document.execCommand('copy');
    alert('Password copied!');
}

// Update the length value displayed based on slider input
function updateLengthValue() {
    const length = document.getElementById('length').value;
    document.getElementById('lengthValue').textContent = length;
}

// Webhook Tool Logic
async function sendWebhook() {
    const url = document.getElementById('webhook-url').value;
    const name = document.getElementById('webhook-name').value || 'Webhook Bot';
    const message = document.getElementById('webhook-message').value;

    if (!url || !message) {
        alert('Please fill in the URL and message!');
        return;
    }

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: name,
                content: message
            })
        });

        if (response.ok) {
            alert('Message sent!');
            document.getElementById('webhook-message').value = '';
        } else {
            alert('Failed to send message!');
        }
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

// IP Info Tool Logic
async function getIpInfo() {
    const ipAddress = document.getElementById('ip-address').value;
    const ipInfoField = document.getElementById('ip-info');

    if (!ipAddress) {
        alert('Please enter an IP address!');
        return;
    }

    try {
        const response = await fetch(`https://ipinfo.io/${ipAddress}/json?token=889d25ffe7b504`);
        const data = await response.json();

        if (response.ok) {
            ipInfoField.value = JSON.stringify(data, null, 2);
        } else {
            alert('Error retrieving IP info!');
        }
    } catch (error) {
        alert('Error: ' + error.message);
    }
}
