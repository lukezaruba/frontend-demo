// Loading project data
import projects from "./projects.json" with { type: "json" };

// Function to shuffle array of projects for random display order on each load
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Dynamic chip creator for tags
function createChip(tag, { showLabel = false } = {}) {
  const chip = document.createElement("calcite-chip");
  chip.setAttribute("icon", tag.icon);
  chip.setAttribute("scale", "s");
  chip.setAttribute("value", tag.label);
  if (showLabel) chip.textContent = tag.label;
  return chip;
}

// Creating project cards
const grid = document.getElementById("card-grid");
const dialog = document.getElementById("project-dialog");
const dialogBody = document.getElementById("dialog-body");
const closeBtn = document.getElementById("dialog-close-btn");

const shuffled = shuffle(projects);

shuffled.forEach((proj, idx) => {
  // Loop through projects and create a card for each
  const card = document.createElement("calcite-card");
  card.setAttribute("label", proj.title);

  // Add thumbnail
  const img = document.createElement("img");
  img.setAttribute("slot", "thumbnail");
  img.setAttribute("alt", proj.title);
  img.setAttribute("src", proj.image);
  card.appendChild(img);

  // Add heading
  const heading = document.createElement("span");
  heading.setAttribute("slot", "heading");
  heading.textContent = proj.title;
  card.appendChild(heading);

  // Add author
  const desc = document.createElement("span");
  desc.setAttribute("slot", "description");
  desc.textContent = proj.author;
  card.appendChild(desc);

  // Add tags (first 3 only)
  const footerStart = document.createElement("div");
  footerStart.setAttribute("slot", "footer-start");
  footerStart.className = "chip-row";

  proj.tags.slice(0, 3).forEach((tag, tIdx) => {
    const chipId = `chip-${idx}-${tIdx}`;
    const chip = createChip(tag);
    chip.setAttribute("id", chipId);
    footerStart.appendChild(chip);

    const tt = document.createElement("calcite-tooltip");
    tt.setAttribute("reference-element", chipId);
    tt.setAttribute("placement", "bottom");
    tt.textContent = tag.label;
    footerStart.appendChild(tt);
  });
  card.appendChild(footerStart);

  // Add info button to footer to open dialog with more details
  const footerEnd = document.createElement("div");
  footerEnd.setAttribute("slot", "footer-end");
  const action = document.createElement("calcite-action");
  action.setAttribute("scale", "s");
  action.setAttribute("icon", "information-f");
  action.setAttribute("text", "More info");
  action.setAttribute("title", "View details");
  action.addEventListener("click", () => openDialog(proj));
  footerEnd.appendChild(action);
  card.appendChild(footerEnd);

  grid.appendChild(card);
});

// Dialog population and open function
function openDialog(proj) {
  dialog.setAttribute("heading", proj.title);
  dialog.setAttribute("description", proj.author);

  dialogBody.innerHTML = "";

  const img = document.createElement("img");
  img.src = proj.image;
  img.alt = proj.title;
  dialogBody.appendChild(img);

  const descP = document.createElement("p");
  descP.className = "dialog-description";
  descP.textContent = proj.description;
  dialogBody.appendChild(descP);

  const tagsDiv = document.createElement("div");
  tagsDiv.className = "dialog-tags";
  proj.tags.forEach((tag) => {
    tagsDiv.appendChild(createChip(tag, { showLabel: true }));
  });
  dialogBody.appendChild(tagsDiv);

  dialog.setAttribute("open", "");
}

closeBtn.addEventListener("click", () => {
  dialog.removeAttribute("open");
});

// Theme switcher
const themes = [
  {
    key: "theme-light",
    mode: "calcite-mode-light",
    label: "Light",
    icon: "brightness",
  },
  { key: "theme-dark", mode: "calcite-mode-dark", label: "Dark", icon: "moon" },
  {
    key: "theme-umn",
    mode: "calcite-mode-dark",
    label: "Minnesota",
    icon: "education",
  },
];

let currentThemeIdx = 0;

const themeBtn = document.getElementById("theme-btn");

function applyTheme(idx) {
  const html = document.documentElement;

  // Remove all theme and mode classes (deduplicated — multiple themes share a mode)
  new Set(themes.flatMap((t) => [t.key, t.mode])).forEach((cls) =>
    html.classList.remove(cls),
  );

  const theme = themes[idx];
  html.classList.add(theme.mode);
  html.classList.add(theme.key);

  themeBtn.setAttribute("icon", theme.icon);
  themeBtn.setAttribute("text", theme.label);
  themeBtn.setAttribute("title", `Theme: ${theme.label}`);
}

// Apply default theme on load
applyTheme(currentThemeIdx);

themeBtn.addEventListener("click", () => {
  currentThemeIdx = (currentThemeIdx + 1) % themes.length;
  applyTheme(currentThemeIdx);
});
