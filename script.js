document.addEventListener("DOMContentLoaded", () => {
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

            resultsContainer.innerHTML = `
                <div class="server-card">
                    <h3>${data.Data.hostname}</h3>
                    <p>🌐 IP: ${serverIP}</p>
                    <p>👥 Players: ${data.Data.clients}/${data.Data.sv_maxclients}</p>
                    <button onclick="window.location.href='fivem://connect/${serverIP}'">
                        Connect to Server
                    </button>
                </div>
            `;
        } catch (error) {
            resultsContainer.innerHTML = '<div class="error-message">No servers found.</div>';
        }
    };

    document.getElementById("searchButton").addEventListener("click", searchServers);
    document.getElementById("searchInput").addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            searchServers();
        }
    });

    document.getElementById("downloadProxies").addEventListener("click", async () => {
        const proxyType = document.getElementById("proxyType").value;
        let apiUrl = `https://api.proxyscrape.com/v4/free-proxy-list/get?request=display_proxies&protocol=${proxyType}&proxy_format=protocolipport&format=text&timeout=20000`;

        try {
            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error("Failed to fetch proxies");
            const proxies = await response.text();

            const blob = new Blob([proxies], { type: "text/plain" });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = "bremboproxy.txt";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            alert("Error fetching proxies: " + error.message);
        }
    });

    document.getElementById("generatePassword").addEventListener("click", async () => {
        const length = document.getElementById("passwordLength").value;
        const uppercase = document.getElementById("uppercase").checked ? "&uppercase" : "";
        const lowercase = document.getElementById("lowercase").checked ? "&lowercase" : "";
        const numbers = document.getElementById("numbers").checked ? "&numbers" : "";
        const special = document.getElementById("special").checked ? "&special" : "";

        const apiUrl = `https://api.genratr.com/?length=${length}${uppercase}${lowercase}${numbers}${special}`;

        try {
            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error("Failed to generate password");
            const password = await response.text();
            document.getElementById("generatedPassword").value = password;
        } catch (error) {
            alert("Error generating password: " + error.message);
        }
    });

    document.getElementById("copyPassword").addEventListener("click", () => {
        const passwordField = document.getElementById("generatedPassword");
        passwordField.select();
        document.execCommand("copy");
        alert("Password copied to clipboard!");
    });
});
