document.addEventListener("DOMContentLoaded", async () => {
  // Set the tab title
  document.title = "New tab";
  // Defaults
  const defaults = {
    tryhackmeId: "3397377",
    githubUsername: "neerajjayesh",
    backgroundUrl: "https://images.unsplash.com/photo-1508138221679-760a23a2285b?q=80&w=1920&auto=format&fit=crop"
  };

  // Load from storage (or use defaults)
  const settings = await new Promise(resolve => chrome.storage.sync.get(defaults, resolve));

  // Apply background
  document.body.style.backgroundImage = `url("${settings.backgroundUrl}")`;

  // Fetch and display GitHub contributions for the current month using GraphQL API
  const ghDivThis = document.getElementById("gh-contrib-this");
  const ghDivLast = document.getElementById("gh-contrib-last");
  const username = settings.githubUsername || "neerajjayesh";
  const githubToken = settings.githubToken || "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";
  try {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    // This month
    const startThis = `${year}-${month.toString().padStart(2, '0')}-01T00:00:00Z`;
    const nextMonth = new Date(year, month, 1);
    const endThis = nextMonth.toISOString().slice(0, 10) + 'T00:00:00Z';
    // Last month
    const lastMonthDate = new Date(year, month - 2, 1);
    const startLast = `${lastMonthDate.getFullYear()}-${(lastMonthDate.getMonth() + 1).toString().padStart(2, '0')}-01T00:00:00Z`;
    const endLast = `${year}-${month.toString().padStart(2, '0')}-01T00:00:00Z`;

    // GraphQL query for both months
    const query = {
      query: `query {
        user(login: \"${username}\") {
          thisMonth: contributionsCollection(from: \"${startThis}\", to: \"${endThis}\") { contributionCalendar { totalContributions } }
          lastMonth: contributionsCollection(from: \"${startLast}\", to: \"${endLast}\") { contributionCalendar { totalContributions } }
        }
      }`
    };
    const resp = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${githubToken}`
      },
      body: JSON.stringify(query)
    });
    if (!resp.ok) {
      ghDivThis.textContent = "Could not fetch (API/network error).";
      ghDivLast.textContent = "";
      return;
    }
    const data = await resp.json();
    const thisCount = data?.data?.user?.thisMonth?.contributionCalendar?.totalContributions;
    const lastCount = data?.data?.user?.lastMonth?.contributionCalendar?.totalContributions;
    if (typeof thisCount === "number") {
      ghDivThis.textContent = `Contributions\nthis Month: ${thisCount}`;
    } else {
      ghDivThis.textContent = "Could not fetch (no data).";
    }
    if (typeof lastCount === "number") {
      ghDivLast.textContent = `Contributions\nlast Month: ${lastCount}`;
    } else {
      ghDivLast.textContent = "";
    }
  } catch (e) {
    ghDivThis.textContent = "Could not fetch (error).";
    ghDivLast.textContent = "";
  }
});
