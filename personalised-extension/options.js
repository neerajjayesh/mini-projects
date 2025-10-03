  const defaults = {
    tryhackmeId: "3397377",
    githubUsername: "neerajjayesh",
    backgroundUrl: "https://images.unsplash.com/photo-1508138221679-760a23a2285b?q=80&w=1920&auto=format&fit=crop"
  };

  const thmInput = document.getElementById("thm");
  const ghInput = document.getElementById("gh");
  const bgInput = document.getElementById("bg");
  const status = document.getElementById("status");

  // Load saved
  chrome.storage.sync.get(defaults, (items) => {
    thmInput.value = items.tryhackmeId;
    ghInput.value = items.githubUsername;
    bgInput.value = items.backgroundUrl;
  });

  // Save
  document.getElementById("settings-form").addEventListener("submit", (e) => {
    e.preventDefault();
    chrome.storage.sync.set({
      tryhackmeId: thmInput.value.trim(),
      githubUsername: ghInput.value.trim(),
      backgroundUrl: bgInput.value.trim()
    }, () => {
      status.textContent = "✅ Saved!";
      setTimeout(() => status.textContent = "", 2000);
    });
  });
;
document.addEventListener("DOMContentLoaded", () => {
  const defaults = {
    tryhackmeId: "3397377",
    githubUsername: "neerajjayesh",
    backgroundUrl: "https://images.unsplash.com/photo-1508138221679-760a23a2285b?q=80&w=1920&auto=format&fit=crop",
    githubToken: ""
  };

  const thmInput = document.getElementById("thm");
  const ghInput = document.getElementById("gh");
  const bgInput = document.getElementById("bg");
  const tokenInput = document.getElementById("ghtoken");
  const status = document.getElementById("status");

  // Load saved
  chrome.storage.sync.get(defaults, (items) => {
    thmInput.value = items.tryhackmeId;
    ghInput.value = items.githubUsername;
    bgInput.value = items.backgroundUrl;
    tokenInput.value = items.githubToken || "";
  });

  // Save
  document.getElementById("settings-form").addEventListener("submit", (e) => {
    e.preventDefault();
    chrome.storage.sync.set({
      tryhackmeId: thmInput.value.trim(),
      githubUsername: ghInput.value.trim(),
      backgroundUrl: bgInput.value.trim(),
      githubToken: tokenInput.value.trim()
    }, () => {
      status.textContent = "\u2705 Saved!";
      setTimeout(() => status.textContent = "", 2000);
    });
  });
});
