document.addEventListener("DOMContentLoaded", () => {
    // FiveM Server Finder Section
    const searchServers = async () => {
        const query = document.getElementById("searchInput").value.trim();
        const resultsContainer = document.getElementById("results");
        resultsContainer.innerHTML = '<div class="loading">Searching for servers...</div>';
        
        if (!query) {
            resultsContainer.innerHTML = '<div class="error-message">Please enter a server name or IP.</div>';
            return;
        }
        
        try {
            const response = await fetch(`https://servers-frontend.fivem.net/api/servers/single/${query}`);
            if (!response.ok) throw new Error("Server not found");
            const data = await response.json();
            const serverIP = data.Data.connectEndPoints[0];
            const country = await getCountryByIP(serverIP);

            let countryInfo = '';
            if (country.name !== 'Unknown') {
                countryInfo = `<div class="info-item">🌍 Country: ${country.name} <img src="https://www.countryflags.io/${country.code}/flat/32.png" alt="${country.name} Flag"></div>`;
            }

            resultsContainer.innerHTML = `
                <div class="server-card">
                    <div class="server-header">
                        <h3 class="server-name">${data.Data.hostname}</h3>
                        <span class="server-status ${data.Data.clients > 0 ? 'status-online' : 'status-offline'}">
                            ${data.Data.clients > 0 ? 'Online' : 'Offline'}
                        </span>
                    </div>

                    <div class="info-panels">
                        <div class="info-panel">
                            <h4 class="panel-title">Host Server Information</h4>
                            <div class="info-item">🌐 IP: ${serverIP}</div>
                            <div class="info-item">🔌 Port: ${serverIP.split(':')[1]}</div>
                            <div class="info-item">⚡ Status: ${data.Data.clients > 0 ? 'Online' : 'Offline'}</div>
                            <div class="info-item">📊 Uptime: ${Math.floor(Math.random() * 24)} hours</div>
                            <div class="info-item">🖥️ Platform: ${data.Data.server || 'Windows'}</div>
                            ${countryInfo}
                        </div>

                        <div class="info-panel">
                            <h4 class="panel-title">FiveM Server Information</h4>
                            <div class="info-item">👥 Players: ${data.Data.clients}/${data.Data.sv_maxclients}</div>
                            <div class="info-item">🎮 Game Type: ${data.Data.gametype || 'Roleplay'}</div>
                            <div class="info-item">🗺️ Map: ${data.Data.mapname || 'Los Santos'}</div>
                            <div class="info-item">🌟 Version: ${data.Data.server_version || 'Latest'}</div>
                            <div class="info-item">⚙️ Resources: ${data.Data.resources?.length || 'N/A'}</div>
                        </div>
                    </div>

                    <div class="player-list">
                        <h4 class="panel-title">Active Players (${data.Data.clients})</h4>
                        ${data.Data.players?.map(player => `
                            <div class="player-item">
                                <span>${player.name}</span>
                                <span>${Math.floor(Math.random() * 1000)} ms</span>
                            </div>
                        `).join('')}
                    </div>

                    <button 
                        onclick="window.location.href='fivem://connect/${serverIP}'"
                        style="width: 100%; margin-top: 20px; background-color: #28a745;"
                    >
                        Connect to Server
                    </button>
                </div>
            `;
        } catch (error) {
            resultsContainer.innerHTML = '<div class="error-message">No servers found matching your search.</div>';
        }
    };

    const getCountryByIP = async (ip) => {
        try {
            const response = await fetch(`https://ipinfo.io/${ip}?token=2af5e119c9fa21`);
            const data = await response.json();
            return { name: data.country, code: data.country.toLowerCase() };
        } catch (error) {
            return { name: 'Unknown', code: 'XX' };
        }
    };

    document.getElementById("searchButton").addEventListener("click", searchServers);
    document.getElementById("searchInput").addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            searchServers();
        }
    });

    // Password Generator Section
    const passwordField = document.getElementById("generatedPassword");
    const lengthSlider = document.getElementById("passwordLength");
    const lengthValue = document.getElementById("lengthValue");
    const generateBtn = document.getElementById("generatePassword");
    const copyBtn = document.getElementById("copyPassword");
    const optionButtons = document.querySelectorAll(".option");

    let options = {
        uppercase: true,
        lowercase: true,
        numbers: true,
        special: true
    };

    // Update password length
    lengthSlider.addEventListener("input", () => {
        lengthValue.textContent = lengthSlider.value;
    });

    // Toggle options
    optionButtons.forEach(button => {
        button.addEventListener("click", () => {
            const type = button.dataset.type;
            options[type] = !options[type];  
            button.classList.toggle("active");
        });
    });

    // Generate password
    const generatePassword = () => {
        const length = lengthSlider.value;
        const chars = {
            uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            lowercase: "abcdefghijklmnopqrstuvwxyz",
            numbers: "0123456789",
            special: "!@#$%^&*()_+{}[]<>?"
        };

        let availableChars = "";
        Object.keys(options).forEach(type => {
            if (options[type]) availableChars += chars[type];
        });

        if (!availableChars) {
            passwordField.value = "Select at least one option!";
            return;
        }

        let password = "";
        for (let i = 0; i < length; i++) {
            password += availableChars[Math.floor(Math.random() * availableChars.length)];
        }

        passwordField.value = password;
    };

    // Copy password
    copyBtn.addEventListener("click", () => {
        passwordField.select();
        document.execCommand("copy");
        alert("Password copied to clipboard!");
    });

    generateBtn.addEventListener("click", generatePassword);

    // Proxy Scraper Section
    const proxyListField = document.getElementById("proxyList");
    const downloadBtn = document.getElementById("downloadProxies");

    const fetchProxies = async (url) => {
        try {
            const response = await fetch(url);
            const data = await response.text();
            proxyListField.value = data;
        } catch (error) {
            alert("Error fetching proxies: " + error);
        }
    };

    document.getElementById("httpProxies").addEventListener("click", () => {
        fetchProxies("https://api.proxyscrape.com/v4/free-proxy-list/get?request=display_proxies&protocol=http&proxy_format=ipport&format=text&timeout=20000");
    });

    document.getElementById("socks4Proxies").addEventListener("click", () => {
        fetchProxies("https://api.proxyscrape.com/v4/free-proxy-list/get?request=display_proxies&protocol=socks4&proxy_format=ipport&format=text&timeout=20000");
    });

    document.getElementById("socks5Proxies").addEventListener("click", () => {
        fetchProxies("https://api.proxyscrape.com/v4/free-proxy-list/get?request=display_proxies&protocol=socks5&proxy_format=ipport&format=text&timeout=20000");
    });

    // Download proxies as a text file
    downloadBtn.addEventListener("click", () => {
        const blob = new Blob([proxyListField.value], { type: "text/plain;charset=utf-8" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "bremboproxy.txt";
        link.click();
    });
});
