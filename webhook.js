function sendWebhook() {
    const url = document.getElementById('webhookUrl').value;
    const name = document.getElementById('webhookName').value || "Webhook";
    const avatar = document.getElementById('avatarUrl').value;
    const message = document.getElementById('message').value;

    const payload = { username: name, avatar_url: avatar, content: message };

    fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    })
    .then(() => alert("Message sent!"))
    .catch(err => alert("Error: " + err));
}
