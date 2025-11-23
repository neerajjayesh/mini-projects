document.addEventListener("DOMContentLoaded", async () => {
  // Set the tab title
  document.title = "New tab";
  // Settings button handler (CSP safe)
  var btn = document.getElementById('settings-btn');
  if (btn) {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      window.open('options.html', '_blank');
    });
  }

  // Defaults (no sensitive info)
  const defaults = {
    tryhackmeId: "",
    githubUsername: "",
    githubToken: "",
    backgroundUrl: "https://images.unsplash.com/photo-1508138221679-760a23a2285b?q=80&w=1920&auto=format&fit=crop"
  };

  // Load from storage (or use defaults)
  const settings = await new Promise(resolve => chrome.storage.sync.get(defaults, resolve));

  // Apply background
  document.body.style.backgroundImage = `url("${settings.backgroundUrl}")`;

  // Dynamically set TryHackMe iframe src
  var thmIframe = document.getElementById('thm-iframe');
  if (thmIframe) {
    if (settings.tryhackmeId && settings.tryhackmeId.trim() !== "") {
      thmIframe.src = `https://tryhackme.com/api/v2/badges/public-profile?userPublicId=${encodeURIComponent(settings.tryhackmeId.trim())}`;
    } else {
      thmIframe.src = "";
    }
  }

  // Embedded site handling: show fallback if iframe blocked
  var embeddedIframe = document.getElementById('embedded-site-iframe');
  var embeddedFallback = document.getElementById('embedded-site-fallback');
  var embeddedOpenLink = document.getElementById('embedded-open-link');
  if (embeddedOpenLink) {
    embeddedOpenLink.href = 'https://cybersecurity-lab-register-duk.vercel.app/';
  }
  if (embeddedIframe) {
    // Try detecting load success; some sites block framing (X-Frame-Options/CSP)
    var loadTimeout = setTimeout(() => {
      // After 4 seconds, if iframe didn't load visible content, show fallback
      // We can't directly read iframe contents due to cross-origin; instead use onload
      if (embeddedFallback) embeddedFallback.style.display = 'block';
      embeddedIframe.style.display = 'none';
    }, 4000);

    embeddedIframe.addEventListener('load', function() {
      clearTimeout(loadTimeout);
      // If the iframe's contentWindow.location is accessible, assume loaded; otherwise still visible
      embeddedFallback.style.display = 'none';
      embeddedIframe.style.display = 'block';
    });
    // If an error event exists, show fallback
    embeddedIframe.addEventListener('error', function() {
      clearTimeout(loadTimeout);
      if (embeddedFallback) embeddedFallback.style.display = 'block';
      embeddedIframe.style.display = 'none';
    });
  }

  // --- To-Do list (stored in chrome.storage.sync) ---
  const todoForm = document.getElementById('todo-form');
  const todoInput = document.getElementById('todo-input');
  const todoListEl = document.getElementById('todo-list');
  const todoEmptyEl = document.getElementById('todo-empty');
  const todoToggleBtn = document.getElementById('todo-toggle-completed');
  let showCompleted = false; // state for toggling view

  function renderTodos(todos) {
    if (!todoListEl) return;
    todoListEl.innerHTML = '';
    const arr = Array.isArray(todos) ? todos : [];
    const filtered = arr.filter(t => showCompleted ? !!t.done : !t.done);
    if (!filtered.length) {
      if (todoEmptyEl) {
        todoEmptyEl.textContent = showCompleted ? 'No completed tasks' : 'No tasks yet';
        todoEmptyEl.style.display = 'block';
      }
      return;
    }
    if (todoEmptyEl) todoEmptyEl.style.display = 'none';
    filtered.forEach((t) => {
      const idx = arr.indexOf(t);
      const li = document.createElement('li');
      li.className = 'todo-item';
      li.dataset.index = String(idx);

      const cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.checked = !!t.done;

      const span = document.createElement('span');
      span.className = 'todo-text' + (t.done ? ' done' : '');
      span.textContent = t.text;

      const del = document.createElement('button');
      del.className = 'todo-del';
      del.textContent = 'Del';

      cb.addEventListener('change', () => {
        chrome.storage.sync.get({ todos: [] }, (data) => {
          let full = Array.isArray(data.todos) ? data.todos : [];
          if (!full[idx]) return;
          // Animate collapse for removal from current view only when state changes visibility
          const becomingDone = cb.checked;
          const leavingCurrentView = (becomingDone && !showCompleted) || (!becomingDone && showCompleted);
          if (leavingCurrentView) li.classList.add('todo-completing');
          full[idx].done = becomingDone;
          setTimeout(() => {
            chrome.storage.sync.set({ todos: full }, () => renderTodos(full));
          }, leavingCurrentView ? 360 : 0);
        });
      });

      del.addEventListener('click', () => {
        chrome.storage.sync.get({ todos: [] }, (data) => {
          const arr = Array.isArray(data.todos) ? data.todos : [];
          arr.splice(idx, 1);
          chrome.storage.sync.set({ todos: arr }, () => renderTodos(arr));
        });
      });

      li.appendChild(cb);
      li.appendChild(span);
      li.appendChild(del);
      todoListEl.appendChild(li);
    });
  }

  if (todoForm && todoInput) {
    // initial load
    chrome.storage.sync.get({ todos: [] }, (data) => {
      const arr = Array.isArray(data.todos) ? data.todos : [];
      renderTodos(arr);
    });

    todoForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = (todoInput.value || '').trim();
      if (!text) return;
      chrome.storage.sync.get({ todos: [] }, (data) => {
        const arr = Array.isArray(data.todos) ? data.todos : [];
        arr.push({ text, done: false });
        chrome.storage.sync.set({ todos: arr }, () => {
          todoInput.value = '';
          renderTodos(arr);
        });
      });
    });
  }

  if (todoToggleBtn) {
    const todoCard = document.getElementById('todo-card');
    todoToggleBtn.addEventListener('click', () => {
      // Begin fade-out
      if (todoListEl) {
        todoListEl.classList.remove('fade-in');
        todoListEl.classList.add('fade-out');
      }
      const startHeight = todoCard ? todoCard.offsetHeight : null;
      // After fade-out duration (~280ms), switch dataset and re-render
      setTimeout(() => {
        showCompleted = !showCompleted;
        todoToggleBtn.textContent = showCompleted ? 'Show Active' : 'Show Completed';
        todoToggleBtn.title = showCompleted ? 'Show Active Tasks' : 'Show Completed Tasks';
        chrome.storage.sync.get({ todos: [] }, (data) => {
          const arr = Array.isArray(data.todos) ? data.todos : [];
          // Render new set hidden (still faded out)
          renderTodos(arr);
          // Measure new height
          const endHeight = todoCard ? todoCard.offsetHeight : null;
          if (todoCard && startHeight !== null && endHeight !== null) {
            // Animate height change smoothly
            todoCard.style.height = startHeight + 'px';
            // Force reflow
            void todoCard.offsetWidth;
            todoCard.style.height = endHeight + 'px';
            // Cleanup inline height after transition
            const removeHeight = () => {
              todoCard.style.height = '';
              todoCard.removeEventListener('transitionend', removeHeight);
            };
            todoCard.addEventListener('transitionend', removeHeight);
          }
          // Fade-in new content shortly after height anim begins
          setTimeout(() => {
            if (todoListEl) {
              todoListEl.classList.remove('fade-out');
              todoListEl.classList.add('fade-in');
              // Remove fade-in class after animation to keep DOM clean
              setTimeout(() => { todoListEl.classList.remove('fade-in'); }, 320);
            }
          }, 40);
        });
      }, 280); // match CSS fade-out duration
    });
  }

  // Fetch and display GitHub contributions for the current month using GraphQL API
  const ghDivThis = document.getElementById("gh-contrib-this");
  const ghDivLast = document.getElementById("gh-contrib-last");
  const username = settings.githubUsername || "";
  const githubToken = settings.githubToken || "";
  if (!username || !githubToken) {
    ghDivThis.textContent = "Configure GitHub username and token in options.";
    ghDivLast.textContent = "";
    return;
  }
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
