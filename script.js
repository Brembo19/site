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

// IP Lookup using ipapi
async function lookupIP() {
    const ip = document.getElementById("ip-address").value;
    if (!ip) {
        alert("Please enter an IP address.");
        return;
    }

    const apiURL = `https://ipapi.co/${ip}/json/`;

    try {
        const response = await fetch(apiURL);
        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

        const data = await response.json();

        const ipInfo = `
            <strong>IP:</strong> ${data.ip}<br>
            <strong>Country:</strong> ${data.country_name}<br>
            <strong>Region:</strong> ${data.region}<br>
            <strong>City:</strong> ${data.city}<br>
            <strong>Postal Code:</strong> ${data.postal}<br>
            <strong>Latitude:</strong> ${data.latitude}<br>
            <strong>Longitude:</strong> ${data.longitude}<br>
            <strong>Timezone:</strong> ${data.timezone}<br>
            <strong>ISP:</strong> ${data.org}<br>
            <strong>ASN:</strong> ${data.asn}
        `;

        document.getElementById("ip-info").innerHTML = ipInfo;
    } catch (error) {
        document.getElementById("ip-info").innerHTML = `<strong>Error fetching IP info:</strong> ${error.message}`;
    }
}

// Proxy Fetching with CORS Proxy
async function fetchProxies() {
    const proxyType = document.getElementById("proxy-type").value;
    const proxyListDiv = document.getElementById("proxy-list");

    const corsProxy = "https://cors-anywhere.herokuapp.com/";
    const urls = {
        https: corsProxy + "https://www.proxyscrape.com/api/v3/free-proxy-list?request=getproxies&proxy_format=ipport&format=text&type=http",
        socks4: corsProxy + "https://www.proxyscrape.com/api/v3/free-proxy-list?request=getproxies&proxy_format=ipport&format=text&type=socks4",
        socks5: corsProxy + "https://www.proxy-list.download/api/v1/get?type=socks5"
    };

    if (!urls[proxyType]) {
        proxyListDiv.innerHTML = "<strong>Invalid proxy type selected.</strong>";
        return;
    }

    try {
        const response = await fetch(urls[proxyType]);
        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

        const text = await response.text();
        if (!text.trim()) throw new Error("No proxies received from server.");

        proxyListDiv.innerHTML = `<strong>Available ${proxyType.toUpperCase()} Proxies:</strong><br><pre>${text}</pre>`;
        localStorage.setItem("proxyData", text);
    } catch (error) {
        proxyListDiv.innerHTML = `<strong>Error fetching proxies:</strong> ${error.message}`;
    }
}

// Download Proxies
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

// Update password length value
function updateLengthValue() {
    document.getElementById("lengthValue").textContent = document.getElementById("length").value;
}
