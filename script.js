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
    addToPasswordHistory(password);
}

function copyPassword() {
    const passwordField = document.getElementById('generated-password');
    passwordField.select();
    document.execCommand('copy');
    alert('Password copied!');
}

function addToPasswordHistory(password) {
    const historyList = document.getElementById('password-history-list');
    const historyItem = document.createElement('div');
    historyItem.className = 'history-item';
    historyItem.innerHTML = `
        <span>${password}</span>
        <button onclick="this.parentElement.remove()">Delete</button>
    `;
    historyList.insertBefore(historyItem, historyList.firstChild);
}

// Webhook Tool Logic
async function sendWebhook() {
    const url = document.getElementById('webhook-url').value;
    const name = document.getElementById('webhook-name').value;
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
                username: name || 'Webhook Bot',
                content: message
            })
        });

        if (response.ok) {
            addToWebhookHistory(message);
            document.getElementById('webhook-message').value = '';
            alert('Message sent!');
        } else {
            alert('Error sending message');
        }
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

function addToWebhookHistory(message) {
    const historyList = document.getElementById('webhook-history-list');
    const historyItem = document.createElement('div');
    historyItem.className = 'history-item';
    historyItem.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">Delete</button>
    `;
    historyList.insertBefore(historyItem, historyList.firstChild);
}

function clearWebhookHistory() {
    document.getElementById('webhook-history-list').innerHTML = '';
}
