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
    alert('Password copied to clipboard!');
}

// Proxy Fetching Logic
async function fetchProxies() {
    const proxyType = document.getElementById("proxy-type").value;
    const proxyListDiv = document.getElementById("proxy-list");

    if (proxyType === "socks5") {
        proxyListDiv.innerHTML = "<strong>SOCKS5 is currently not available.</strong>";
        return;
    }

    const urls = {
        https: "https://api.proxyscrape.com/v4/free-proxy-list/get?request=display_proxies&protocol=http&proxy_format=ipport&format=text&timeout=20000",
        socks4: "https://api.proxyscrape.com/v4/free-proxy-list/get?request=display_proxies&protocol=socks4&proxy_format=ipport&format=text&timeout=20000"
    };

    try {
        const response = await fetch(urls[proxyType]);
        const text = await response.text();
        proxyListDiv.innerHTML = `<strong>Available ${proxyType.toUpperCase()} Proxies:</strong><br><pre>${text}</pre>`;
        localStorage.setItem("proxyData", text); // Save for downloading
    } catch (error) {
        proxyListDiv.innerHTML = `<strong>Error fetching proxies:</strong> ${error.message}`;
    }
}

function downloadProxies() {
    const proxyData = localStorage.getItem("proxyData");
    if (!proxyData) {
        alert("No proxies available. Please fetch proxies first!");
        return;
    }

    const blob = new Blob([proxyData], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "proxies.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}
