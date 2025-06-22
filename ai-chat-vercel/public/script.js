const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const providerLabel = document.getElementById("provider-label");

function toggleAIProvider() {
  const toggle = document.getElementById("aiToggle");
  CONFIG.provider = toggle.checked ? "google" : "openai";
  providerLabel.textContent = toggle.checked ? "Google AI" : "OpenAI";
}

function appendMessage(sender, text) {
  const message = document.createElement("div");
  message.innerHTML = `<strong>${sender}:</strong> ${text}`;
  chatBox.appendChild(message);
  chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendMessage() {
  const message = userInput.value.trim();
  if (!message) return;

  appendMessage("You", message);
  userInput.value = "";
  appendMessage("AI", "Typing...");

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        provider: CONFIG.provider,
        prompt: message
      })
    });
    const data = await res.json();
    chatBox.lastChild.remove();
    appendMessage("AI", data.reply || "No response.");
  } catch (err) {
    chatBox.lastChild.remove();
    appendMessage("AI", "Error: " + err.message);
  }
}