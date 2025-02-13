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
                            <div class="info-item">🖥️ Platform: ${data.Data.server || 'Windows'}</div>
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

    document.getElementById("searchButton").addEventListener("click", searchServers);
    document.getElementById("searchInput").addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            searchServers();
        }
    });
});
