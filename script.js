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

    if (isNaN(length) || length <= 0) {
        alert('Please enter a valid password length!');
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
    const name = document.getElementById('webhook-name').value;
    const message = document.getElementById('webhook-message').value;

    if (!url || !message) {
        alert('Please provide both a URL and a message!');
        return;
    }

    // Validate URL format
    try {
        new URL(url);
    } catch (error) {
        alert('Please enter a valid URL!');
        return;
    }

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: name || 'Webhook Bot',
                content: message
            })
        });

        if (response.ok) {
            alert('Message sent successfully!');
        } else {
            alert(`Error while sending message: ${response.statusText}`);
        }
    } catch (error) {
        alert('Error while sending message: ' + error.message);
    }
}

// IP Lookup Logic
async function lookupIP() {
    const ipAddress = document.getElementById('ip-address').value;
    const ipInfoDiv = document.getElementById('ip-info');

    if (!ipAddress) {
        alert('Please enter a valid IP address!');
        return;
    }

    const token = '889d25ffe7b504'; // Use your actual token
    const url = `https://ipinfo.io/${ipAddress}/json?token=${token}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.error) {
            ipInfoDiv.innerHTML = `Error: ${data.error.message}`;
        } else {
            ipInfoDiv.innerHTML = `
                <strong>IP Info for ${data.ip}</strong><br>
                City: ${data.city}<br>
                Region: ${data.region}<br>
                Country: ${data.country}<br>
                Location: ${data.loc}<br>
                Organization: ${data.org}
            `;
        }
    } catch (error) {
        ipInfoDiv.innerHTML = `Error: ${error.message}`;
    }
}
