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

const playerInput = document.getElementById("playerInput");
const assignButton = document.getElementById("assignButton");
const resetButton = document.getElementById("resetButton");
const resultsTable = document.getElementById("resultsTable");
const resultsBody = resultsTable.querySelector("tbody");
const resultsPlaceholder = document.getElementById("resultsPlaceholder");
const feedback = document.getElementById("feedback");
const teamCount = document.getElementById("teamCount");
const teamList = document.getElementById("teamList");

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

function assignTeams() {
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
    return;
  }

  const shuffledTeams = shuffle(TEAMS).slice(0, players.length);
  const assignments = players.map((player, index) => ({
    player,
    team: shuffledTeams[index]
  }));

  resultsBody.innerHTML = assignments
    .map(
      ({ player, team }) => `
        <tr>
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
  setFeedback(
    `Equipos asignados a ${assignments.length} jugador${assignments.length === 1 ? "" : "es"}.`,
    "success"
  );
}

function resetForm() {
  playerInput.value = "";
  resultsBody.innerHTML = "";
  resultsTable.hidden = true;
  resultsPlaceholder.textContent = "Los emparejamientos aparecerán aquí.";
  resultsPlaceholder.hidden = false;
  setFeedback("");
  playerInput.focus();
}

assignButton.addEventListener("click", assignTeams);
resetButton.addEventListener("click", resetForm);

playerInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
    assignTeams();
  }
});

renderTeamList();
