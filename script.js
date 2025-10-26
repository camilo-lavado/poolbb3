const TEAMS = [
  // Base game
  { name: "Black Orcs", icon: "🖤" },
  { name: "Chaos Chosen", icon: "🔥" },
  { name: "Chaos Renegades", icon: "🌀" },
  { name: "Dark Elves", icon: "🌙" },
  { name: "Dwarfs", icon: "⛏️" },
  { name: "Elven Union", icon: "✨" },
  { name: "Humans", icon: "🛡️" },
  { name: "Imperial Nobility", icon: "👑" },
  { name: "Nurgle", icon: "☣️" },
  { name: "Old World Alliance", icon: "🤝" },
  { name: "Orcs", icon: "💚" },
  { name: "Skaven", icon: "🐀" },
  // Seasonal releases
  { name: "Lizardmen", icon: "🦎" },
  { name: "Underworld Denizens", icon: "🕳️" },
  { name: "Shambling Undead", icon: "🧟" },
  { name: "Wood Elves", icon: "🌲" },
  { name: "Necromantic Horrors", icon: "🪦" },
  { name: "Halflings", icon: "🥧" },
  { name: "Goblins", icon: "🍀" },
  { name: "Norse", icon: "❄️" },
  { name: "Amazons", icon: "🏹" },
  { name: "Khorne", icon: "🩸" },
  { name: "Vampires", icon: "🦇" }
];

const app = document.querySelector(".app");
const playerInput = document.getElementById("playerInput");
const assignButton = document.getElementById("assignButton");
const resetButton = document.getElementById("resetButton");
const resultsSection = document.getElementById("resultsSection");
const resultsTable = document.getElementById("resultsTable");
const resultsBody = resultsTable.querySelector("tbody");
const resultsPlaceholder = document.getElementById("resultsPlaceholder");
const resultsActions = document.getElementById("resultsActions");
const feedback = document.getElementById("feedback");
const teamCount = document.getElementById("teamCount");
const teamList = document.getElementById("teamList");
const toggleTeamList = document.getElementById("toggleTeamList");
const teamListPanel = document.getElementById("teamListPanel");
const printButton = document.getElementById("printButton");
const rerollButton = document.getElementById("rerollButton");
const startOverButton = document.getElementById("startOverButton");

let lastPlayers = [];

const shuffle = (items) => {
  const array = [...items];
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const setFeedback = (message, variant = "") => {
  if (!feedback) return;
  feedback.textContent = message;
  feedback.className = variant ? `feedback feedback--${variant}` : "feedback";
};

const enterResultsMode = () => {
  if (!app || !resultsSection) return;
  app.classList.add("app--results");
  resultsSection.scrollIntoView({ behavior: "smooth", block: "start" });
};

const exitResultsMode = () => {
  if (!app) return;
  app.classList.remove("app--results");
  if (resultsActions) {
    resultsActions.hidden = true;
  }
};

const renderTeamList = () => {
  if (!teamCount || !teamList) return;
  teamCount.textContent = TEAMS.length;
  teamList.innerHTML = TEAMS.map(
    ({ name, icon }) =>
      `
        <li class="team-pill">
          <span class="team-pill__icon" aria-hidden="true">${icon}</span>
          <span class="team-pill__name">${name}</span>
        </li>
      `.trim()
  ).join("\n");
};

const createAssignments = (players) => {
  const shuffledTeams = shuffle(TEAMS).slice(0, players.length);
  return players.map((player, index) => ({
    player,
    team: shuffledTeams[index]
  }));
};

const renderAssignments = (assignments) => {
  resultsBody.innerHTML = assignments
    .map(
      ({ player, team }, index) => `
        <tr style="--row-index: ${index}">
          <td>${player}</td>
          <td>
            <span class="team-cell">
              <span class="team-cell__icon" aria-hidden="true">${team.icon}</span>
              <span class="team-cell__name">${team.name}</span>
            </span>
          </td>
        </tr>
      `.trim()
    )
    .join("\n");

  resultsPlaceholder.hidden = true;
  resultsTable.hidden = false;
  if (resultsActions) {
    resultsActions.hidden = false;
  }
  setFeedback(
    `Equipos asignados a ${assignments.length} jugador${assignments.length === 1 ? "" : "es"}.`,
    "success"
  );
  enterResultsMode();
};

const handleAssignments = (players) => {
  lastPlayers = [...players];
  const assignments = createAssignments(players);
  renderAssignments(assignments);
};

const assignTeams = () => {
  const players = playerInput.value
    .split(/\r?\n/)
    .map((name) => name.trim())
    .filter(Boolean);

  if (players.length === 0) {
    resultsBody.innerHTML = "";
    resultsTable.hidden = true;
    resultsPlaceholder.textContent = "Agrega al menos un jugador para comenzar.";
    resultsPlaceholder.hidden = false;
    setFeedback("");
    playerInput.focus();
    lastPlayers = [];
    exitResultsMode();
    return;
  }

  if (players.length > TEAMS.length) {
    resultsBody.innerHTML = "";
    resultsTable.hidden = true;
    resultsPlaceholder.textContent = "";
    resultsPlaceholder.hidden = true;
    setFeedback(
      `Hay ${players.length} jugadores pero solo ${TEAMS.length} equipos disponibles.`,
      "error"
    );
    playerInput.focus();
    lastPlayers = [];
    exitResultsMode();
    return;
  }

  handleAssignments(players);
};

const rerollAssignments = () => {
  if (!lastPlayers.length) return;
  handleAssignments(lastPlayers);
};

const resetForm = () => {
  playerInput.value = "";
  resultsBody.innerHTML = "";
  resultsTable.hidden = true;
  resultsPlaceholder.textContent = "Los emparejamientos aparecerán aquí.";
  resultsPlaceholder.hidden = false;
  setFeedback("");
  lastPlayers = [];
  exitResultsMode();
  playerInput.focus();
};

assignButton.addEventListener("click", assignTeams);
resetButton.addEventListener("click", resetForm);

playerInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
    assignTeams();
  }
});

if (toggleTeamList && teamListPanel) {
  let collapseTimeout = null;

  toggleTeamList.addEventListener("click", () => {
    const isExpanded = toggleTeamList.getAttribute("aria-expanded") === "true";
    const nextState = !isExpanded;
    toggleTeamList.setAttribute("aria-expanded", String(nextState));
    toggleTeamList.textContent = nextState ? "Ocultar listado" : "Mostrar listado";

    if (collapseTimeout) {
      clearTimeout(collapseTimeout);
      collapseTimeout = null;
    }

    if (nextState) {
      teamListPanel.hidden = false;
      requestAnimationFrame(() => {
        teamListPanel.classList.add("team-list__container--active");
      });
    } else {
      teamListPanel.classList.remove("team-list__container--active");
      collapseTimeout = window.setTimeout(() => {
        teamListPanel.hidden = true;
        collapseTimeout = null;
      }, 220);
    }
  });
}

if (printButton) {
  printButton.addEventListener("click", () => {
    if (resultsTable.hidden) return;
    window.print();
  });
}

if (rerollButton) {
  rerollButton.addEventListener("click", rerollAssignments);
}

if (startOverButton) {
  startOverButton.addEventListener("click", resetForm);
}

renderTeamList();
