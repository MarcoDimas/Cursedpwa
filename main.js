document.addEventListener("DOMContentLoaded", () => {
  const app = document.getElementById("app");

  // Cargar una vista al iniciar la app
  loadView("home");

  // Manejar clics en el menú
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const view = e.target.getAttribute("href").split("/").pop().replace(".html", ""); // Obtén el nombre de la vista
      loadView(view);
    });
  });

  // Función para cargar vistas dinámicamente
  function loadView(viewName) {
    fetch(`views/${viewName}.html`) // Carga la vista desde la carpeta "views"
      .then((response) => {
        if (!response.ok) throw new Error("Vista no encontrada");
        return response.text();
      })
      .then((html) => {
        app.innerHTML = html;

        // Solo ejecutar lógica adicional si es la vista "api"
        if (viewName === "api") fetchAndDisplayGames();
      })
      .catch((error) => {
        app.innerHTML = `<p>Error al cargar la vista: ${error.message}</p>`;
      });
  }

  // Función para consumir la API y mostrar los datos
  function fetchAndDisplayGames() {
fetch('https://cors-anywhere.herokuapp.com/https://www.freetogame.com/api/games')
    
      .then((response) => {
        if (!response.ok) throw new Error("Error al obtener los juegos");
        return response.json();
      })
      .then((games) => {
        const container = document.createElement("div");
        container.className = "game-list row";

        // Muestra solo algunos datos (por ejemplo, los primeros 10 juegos)
        games.slice(0, 10).forEach((game) => {
          const gameCard = `
            <div class="col-md-4">
              <div class="card mb-3 shadow-sm">
                <img src="${game.thumbnail}" class="card-img-top" alt="${game.title}">
                <div class="card-body">
                  <h5 class="card-title">${game.title}</h5>
                  <p class="card-text">${game.genre} - ${game.platform}</p>
                  <a href="${game.game_url}" target="_blank" class="btn btn-primary">Jugar ahora</a>
                </div>
              </div>
            </div>`;
          container.innerHTML += gameCard;
        });

        // Asegúrate de limpiar y luego agregar el contenido dinámico
        app.innerHTML = ""; // Limpia el contenido actual
        app.appendChild(container); // Agrega el nuevo contenido
      })
      .catch((error) => {
        console.error("Error al obtener los juegos:", error);
        app.innerHTML = `<p class="text-danger">No se pudieron cargar los datos de la API.</p>`;
      });
  }
});
