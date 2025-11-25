# Distraction Blocker — Personalised Glass New Tab

A glassmorphic Chrome extension that replaces the default new tab with a focused, aesthetically pleasing productivity dashboard. It surfaces your learning & coding momentum while keeping noise low.

Current dashboard cards & elements:

- Google search bar (omnibox style)
- Motivational headline text ("You are still average." – adjustable in HTML if desired)
- TryHackMe dynamic badge (public profile iframe)
- GitHub contributions (this month + last month via GraphQL)
- GitHub logo (decorative, top‑right inside contributions card)
- Embedded external site card ("115 Lab" – shows cyber lab site with graceful fallback link)
- To‑Do list with active / completed toggle & smooth animated transitions
- Shortcuts panel (static quick links with favicons)
- Floating settings (gear) button linking to options page
- Custom background image (user supplied URL)

Optional future ideas (not yet implemented): music mini‑player, contribution heatmap SVG, streak charts.

## The Idea

On a random lazy day I came across the badging in TryHackMe that showed the iframe packet that changed according to the users work being done in tryhackme portal. And i started thinking, if I had such an extension that shows my cuurent streak and badge count on my homescreen it can motivate me to maintain that streak. But unfortunatly no such extention was seen in Chrome web store. So I though what is I made such an extension. I went to ChatGPT's extension GPT module and started telling my requirements. and it gave me a working extension but with a shitty UI. Next I did some research and started working on this project and made a glassy type modern and aesthically pleasing UI design with the help of Github Co-pilot. 

## Features

| Area | What It Does | Notes |
|------|--------------|-------|
| Search Bar | Direct Google search or URL entry | Autofocus & glass blur styling |
| Motivator Text | Fixed phrase under search to nudge consistency | Edit in `newtab.html` if you want a custom mantra |
| TryHackMe Badge | Real‑time public badge iframe | Uses your userPublicId (TryHackMe ID) |
| GitHub Contributions | Fetches total contributions for this & last month | Requires PAT (see below) & username; shows fallback message if missing |
| GitHub Logo | Decorative branding positioned absolutely in card | PNG at root: `GitHub.png` |
| Embedded Site (115 Lab) | Attempts iframe embed; shows fallback link if blocked | Scales internally for readable layout |
| To‑Do List | Add tasks, mark complete, view either Active or Completed | Animated fade + height morph during view toggle |
| Completed View | Toggle button swaps list; unchecking restores to Active | No auto deletion; persistent in storage |
| Shortcuts Panel | Quick external links with favicons | Easily extend in HTML markup |
| Settings Button | Floating gear opens options in new tab | CSP‑safe handler (no inline JS) |
| Custom Background | User URL applied to body | Fallback Unsplash image bundled |

### To‑Do List Details
The To‑Do card stores tasks in `chrome.storage.sync` under key `todos` as an array of objects: `{ text: string, done: boolean }`.

Interactions:
- Add: form submit pushes new `{ done:false }` task.
- Complete: checking a task animates collapse (fade + height), then marks `done:true` and moves it to Completed view.
- Restore: switch to Completed, uncheck → animates away then appears in Active.
- Delete: `Del` button immediately removes task.

Animation: View toggle performs fade‑out (280ms), swaps filtered list, height morph, then fade‑in. Per‑item completion uses `.todo-completing` class for collapse.

### Embedded Site Fallback
If the external site cannot be framed (X‑Frame‑Options / CSP), a timed (4s) fallback reveals a message + link to open in a normal tab.

### Security & Privacy
- GitHub PAT is stored only in `chrome.storage.sync` (never transmitted elsewhere except GitHub API request).
- Do NOT commit your token to version control.
- TryHackMe ID is public; embedding uses official badge endpoint.
- No analytics or third‑party tracking added.

## Setup & Installation

1. **Clone or Download** this repository.
2. **Open Chrome** and go to `chrome://extensions/`.
3. Enable **Developer mode** (top right).
4. Click **Load unpacked** and select this project folder.
5. The extension will now override your new tab page.

## Configuration

- Click the extension icon and choose **Options** (or go to the options page).
- Enter your TryHackMe ID, GitHub username, background image URL, and GitHub personal access token (PAT).
- Save your settings.

### How to get a GitHub Personal Access Token
1. Go to [GitHub Tokens](https://github.com/settings/tokens)
2. Click **Generate new token**
3. Give it a name and select `read:user` scope
4. Copy the token and paste it in the options page

## File Structure

- `manifest.json` — Extension metadata & new tab override
- `newtab.html` — Dashboard markup (search, cards, shortcuts, settings button)
- `newtab.js` — Dynamic logic (background, TryHackMe badge URL, GitHub GraphQL fetch, To‑Do state & animations, embed fallback)
- `options.html` / `options.js` — Configuration form & persistence for IDs, token, background
- `styles.css` — Glassmorphic design, responsive layout, animations
- `GitHub.png` — GitHub logo displayed in contributions card
- `icons/` — Extension icon set

## Permissions
- `storage` — Persist user settings & todos
- `https://tryhackme.com/*` — Load iframe badge
- `https://github.com/*` — GraphQL contributions API

> Note: Host permissions are used only for direct API / iframe requests; no broad browsing data access is requested.

## Notes
- Personal productivity tool — no telemetry.
- GitHub token stays in sync storage (encrypted at rest by Chrome). Remove it any time via options.
- If contributions show "Configure GitHub username and token" ensure both fields are filled and token is valid.
- Background image should be a direct image URL (https://... .jpg / .png). Large images may affect load time.

## Troubleshooting
| Issue | Cause | Fix |
|-------|-------|-----|
| TryHackMe badge blank | Empty or incorrect ID | Check ID in options (public profile ID, not username if different) |
| GitHub shows fetch error | Invalid / expired PAT | Regenerate token; ensure network is not blocking api.github.com |
| Embedded site hidden | Framing blocked by site CSP | Use fallback link provided in card |
| Tasks not syncing across devices | Chrome sync disabled | Enable Chrome sync or use same profile |
| Animation feels choppy | Low device performance | Reduce blur values / remove drop-shadows in CSS |

## Customization Tips
- Change motivator text in `newtab.html` (`.motivator-text` div).
- Add more shortcuts by duplicating `<a class="shortcut-link static-shortcut" ...>` entries.
- Adjust glass intensity: tweak `--glass-bg` / `--glass-border` in `:root` inside `styles.css`.
- Reduce blur for performance (`backdrop-filter: blur(6px)` → smaller value).
- Replace GitHub logo size by editing `.gh-logo-img` width/height.

## Roadmap (Potential Enhancements)
- Optional contribution heatmap image
- Light / dark theme toggle
- Quick notes widget
- Pomodoro timer integration
- Keyboard shortcuts (e.g., press `t` to focus To‑Do input)

---

Feel free to fork and adapt. PRs welcome for non‑token functionality improvements.
