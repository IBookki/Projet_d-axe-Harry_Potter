document.addEventListener("DOMContentLoaded", function () {
  const menuToggle = document.getElementById("menu-toggle");
  const sidebar = document.querySelector(".sidebar");
  const characterDetails = document.getElementById("character-details");

  const login = document.getElementById("login-form");
  const signin = document.getElementById("signin-form");

  if (login) {
    login.addEventListener("submit", async (event) => {
      console.log("gorh");
      event.preventDefault();
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      const token = data.token;

      localStorage.setItem("token", token);
      window.location = "hp.html";
    });
  }

  if (signin) {
    signin.addEventListener("submit", async (event) => {
      console.log("gorh");
      event.preventDefault();
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      const response = await fetch("http://localhost:3000/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      const token = data.token;

      localStorage.setItem("token", token);
      console.log(token);

      window.location = "hp.html";
    });
  }

  const getMyProfile = async () => {
    const token = localStorage.getItem("token");

    const response = await fetch("http://localhost:3000/getMyProfile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
 
    if (response.ok) {
      const emailElement = document.getElementById("user-email");
      if (emailElement) {
        emailElement.textContent = data.email;
      }
    } else {
      console.error("Erreur lors de la récupération des informations de profil :", data.error);
    }
  };

  menuToggle.addEventListener("click", function () {
    sidebar.classList.toggle("show");
  });

  const houseButtons = document.querySelectorAll(".house-button");
  const showAllButton = document.getElementById("show-all-button");
  let allCharactersDisplayed = false;

  houseButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const selectedHouse = button.dataset.house;
      filterCharactersByHouse(selectedHouse);
      allCharactersDisplayed = false;
    });
  });

  showAllButton.addEventListener("click", () => {
    if (!allCharactersDisplayed) {
      displayCharacters();
      allCharactersDisplayed = true;
    }
  });

  async function filterCharactersByHouse(house) {
    const data = await fetchCharacters();
    const filteredCharacters = data.filter(
      (character) => character.house === house
    );
    displayFilteredCharacters(filteredCharacters);
  }

  function displayFilteredCharacters(characters) {
    const charactersContainer = document.querySelector("#characters");
    charactersContainer.innerHTML = ""; 
    characters.forEach((character) => {
      charactersContainer.innerHTML += `
        <div class="card" data-name="${character.name}" data-house="${character.house}" data-actor="${character.actor}">
          <img src="${character.image}" alt="${character.name}">
        </div>
      `;
    });
    attachEventListeners();
  }

  async function getMyId() {
    const token = localStorage.getItem("token");
    console.log(token);

    const response = await fetch("http://localhost:3000/getMyProfile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status == 200) {
      const data = await response.json();
      return data.id;
    }
  }

  function UpdateLastHouse(id, house) {
    let baseUrl = "http://localhost:3000/users/" + id;
    console.log(id);
    console.log(house);
    return fetch(baseUrl, {
      method: "PUT",
      body: JSON.stringify({
        house: house,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  async function UpdateHouse(house) {
    try {
      await UpdateLastHouse(await getMyId(), house);
    } catch {
      console.log("You're not connected");
    }
  }

  function fetchCharacters() {
    return fetch("https://hp-api.lainocs.fr/characters").then((response) =>
      response.json()
    );
  }

  async function displayCharacters() {
    const charactersContainer = document.querySelector("#characters");
    charactersContainer.innerHTML = "";
    const data = await fetchCharacters();
    data.forEach((character) => {
      charactersContainer.innerHTML += `
        <div class="card" data-name="${character.name}" data-house="${character.house}" data-actor="${character.actor}">
          <img src="${character.image}" alt="${character.name}">
        </div>
      `;
    });
    attachEventListeners();
  }

  function attachEventListeners() {
    const cards = document.querySelectorAll(".card");
    cards.forEach((card) => {
      card.addEventListener("click", (event) => {
        event.preventDefault();

        const name = card.dataset.name;
        const house = card.dataset.house;
        const actor = card.dataset.actor;

        const detailsContainer =
          document.querySelector("#character-details");
        detailsContainer.innerHTML = `
          <h2>${name}</h2>
          <p><strong>House:</strong> ${house}</p>
          <p><strong>Actor:</strong> ${actor}</p>
        `;

        detailsContainer.classList.remove("hidden");
        UpdateHouse(house);
      });
    });
  }

  document
    .querySelector("#character-details")
    .addEventListener("click", (event) => {
      const detailsContainer = document.querySelector("#character-details");
      detailsContainer.classList.add("hidden");
    });

  displayCharacters();

  if (window.innerWidth < 600) {
    document.querySelector(".nav").style.display = "none";
  }
});

var menu_btn = document.querySelector("#menu-btn");
var sidebar = document.querySelector("#sidebar");
var container = document.querySelector(".my-container");
menu_btn.addEventListener("click", () => {
  sidebar.classList.toggle("active-nav");
  container.classList.toggle("active-cont");
});
