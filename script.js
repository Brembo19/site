// Password Generator Logic
function generatePassword() {
    const length = document.getElementById('length').value;
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
    alert('Password copied to clipboard!');
}

function updateLengthValue() {
    const lengthValue = document.getElementById('length').value;
    document.getElementById('lengthValue').textContent = lengthValue;
}

// Webhook Tool Logic
async function sendWebhook() {
    const url = document.getElementById('webhook-url').value;
    const name = document.getElementById('webhook-name').value || "Webhook Bot";
    const message = document.getElementById('webhook-message').value;

    if (!url || !message) {
        alert('Please fill out the URL and message!');
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
            alert('Webhook message sent!');
        } else {
            alert('Error sending message.');
        }
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

// IP Tool Logic
async function getIPInfo() {
    const ipAddress = document.getElementById('ip-address').value;
    const token = "889d25ffe7b504";
    const url = `https://ipinfo.io/${ipAddress}?token=${token}`;

    if (!ipAddress) {
        alert('Please enter an IP address!');
        return;
    }

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.error) {
            alert('Error fetching IP information.');
        } else {
            const ipInfo = `
                <p><strong>IP:</strong> ${data.ip}</p>
                <p><strong>Location:</strong> ${data.city}, ${data.region}, ${data.country}</p>
                <p><strong>Organization:</strong> ${data.org}</p>
                <p><strong>Hostname:</strong> ${data.hostname}</p>
            `;
            document.getElementById('ip-info').innerHTML = ipInfo;
        }
    } catch (error) {
        alert('Error: ' + error.message);
    }
}
