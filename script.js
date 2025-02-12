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

// Webhook Sender
async function sendWebhook() {
    const url = document.getElementById("webhook-url").value;
    const name = document.getElementById("webhook-name").value || "Webhook Bot";
    const message = document.getElementById("webhook-message").value;

    if (!url || !message) {
        alert("Please provide both webhook URL and message.");
        return;
    }

    const payload = {
        username: name,
        content: message
    };

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            alert("Webhook sent successfully!");
        } else {
            alert("Failed to send webhook.");
        }
    } catch (error) {
        alert("Error: " + error.message);
    }
}

// IP Lookup using multiple APIs
async function lookupIP() {
    const ip = document.getElementById("ip-address").value;
    if (!ip) {
        alert("Please enter an IP address.");
        return;
    }

    const apis = [
        `https://ipapi.co/${ip}/json/`,
        `https://ipwho.is/${ip}`,
        `https://ipinfo.io/${ip}/json`
    ];

    try {
        const responses = await Promise.all(apis.map(api => fetch(api)));
        const data = await Promise.all(responses.map(res => res.json()));

        let ipInfo = `
            <strong>IP:</strong> ${data[0].ip || ip}<br>
            <strong>Country:</strong> ${data[0].country_name || data[1].country || data[2].country}<br>
            <strong>Region:</strong> ${data[0].region || data[1].region || data[2].region}<br>
            <strong>City:</strong> ${data[0].city || data[1].city || data[2].city}<br>
            <strong>ISP:</strong> ${data[0].org || data[1].connection?.isp || data[2].org}<br>
            <strong>ASN:</strong> ${data[0].asn || data[1].asn || "N/A"}
        `;

        document.getElementById("ip-info").innerHTML = ipInfo;
    } catch (error) {
        document.getElementById("ip-info").innerHTML = `<strong>Error fetching IP info:</strong> ${error.message}`;
    }
}

// Proxy Fetching
async function fetchProxies() {
    const proxyType = document.getElementById("proxy-type").value;
    const proxyListDiv = document.getElementById("proxy-list");

    const urls = {
        https: "https://www.proxyscrape.com/api/v3/free-proxy-list?request=getproxies&proxy_format=ipport&format=text&type=http",
        socks4: "https://www.proxyscrape.com/api/v3/free-proxy-list?request=getproxies&proxy_format=ipport&format=text&type=socks4",
        socks5: "https://www.proxy-list.download/api/v1/get?type=socks5"
    };

    if (!urls[proxyType]) {
        proxyListDiv.innerHTML = "<strong>Invalid proxy type selected.</strong>";
        return;
    }

    try {
        const response = await fetch(urls[proxyType]);
        const text = await response.text();
        if (text.trim() === "") {
            proxyListDiv.innerHTML = `<strong>No proxies available for ${proxyType.toUpperCase()}.</strong>`;
            return;
        }

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
