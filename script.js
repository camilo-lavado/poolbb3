const TEAMS = [
  "Amazons",
  "Black Orcs",
  "Chaos Chosen",
  "Chaos Renegades",
  "Dark Elves",
  "Dwarfs",
  "Elven Union",
  "Goblin",
  "Humans",
  "Imperial Nobility",
  "Khorne",
  "Lizardmen",
  "Necromantic Horror",
  "Nurgle",
  "Old World Alliance",
  "Orcs",
  "Shambling Undead",
  "Skaven",
  "Underworld Denizens",
  "Wood Elves"
];

const playerInput = document.getElementById("playerInput");
const assignButton = document.getElementById("assignButton");
const resetButton = document.getElementById("resetButton");
const resultsTable = document.getElementById("resultsTable");
const resultsBody = resultsTable.querySelector("tbody");
const resultsPlaceholder = document.getElementById("resultsPlaceholder");

const pickRandomTeam = () => TEAMS[Math.floor(Math.random() * TEAMS.length)];

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
    playerInput.focus();
    return;
  }

  const assignments = players.map((player) => ({
    player,
    team: pickRandomTeam()
  }));

  resultsBody.innerHTML = assignments
    .map(
      ({ player, team }) => `
        <tr>
          <td>${player}</td>
          <td>${team}</td>
        </tr>
      `.trim()
    )
    .join("\n");

  resultsPlaceholder.hidden = true;
  resultsTable.hidden = false;
}

function resetForm() {
  playerInput.value = "";
  resultsBody.innerHTML = "";
  resultsTable.hidden = true;
  resultsPlaceholder.textContent = "Los emparejamientos aparecerán aquí.";
  resultsPlaceholder.hidden = false;
  playerInput.focus();
}

assignButton.addEventListener("click", assignTeams);
resetButton.addEventListener("click", resetForm);

playerInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
    assignTeams();
  }
});
