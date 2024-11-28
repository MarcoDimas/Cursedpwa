const cacheName = 'v1';
const cacheAssets = [
  '/',
  '/index.html',
  '/manifest.json',
  '/styles.css', // Corrige el nombre del archivo CSS si es styles.css
  '/main.js',
  '/Cursedpwa/assets/icon-128.png',
  '/Cursedpwa/assets/icon-512.png',
  '/Cursedpwa/assets/jugador1.jpg',
  '/Cursedpwa/assets/jugador2.jpg',
  '/Cursedpwa/assets/jugador3.jpg',
  '/Cursedpwa/assets/temple-background.jpg',
  '/Cursedpwa/assets/background-texture.jpg',
  '/Cursedpwa/assets/terreno1.jpg ',
  '/Cursedpwa/assets/terreno2.jpg',
  '/views/home.html',        // Agrega las vistas
  '/views/api.html',
  '/views/acercaJuego.html',
  '/views/niveles.html',
  '/views/instalacion.html',
  '/views/contacto.html',
  '/Cursedpwa/assets/dani.jpg',
  '/Cursedpwa/assets/pasodos.jpg',
  '/Cursedpwa/assets/pasotres.jpg',
  '/Cursedpwa/assets/pasocuatro.jpg',

  


];

// Instalación del Service Worker
self.addEventListener('install', e => {
    // Espera hasta que todos los archivos estén en caché antes de completar la instalación
    e.waitUntil(
        caches.open(cacheName) // Abre (o crea) el caché con el nombre especificado
            .then(cache => {
                // Agrega todos los archivos en `assets` al caché
                return cache.addAll(assets)
                    .then(() => self.skipWaiting()); // Fuerza al SW a activarse inmediatamente después de instalarse
            })
            .catch(err => console.log('Falló registro de cache', err)) // Log de errores en caso de que falle
    );
});
// Activación del Service Worker
self.addEventListener('activate', e => {
    // Lista de cachés permitidos (whitelist) que queremos conservar
    const cacheWhitelist = [cacheName];

    // Elimina cachés antiguos que no están en la lista de permitidos
    e.waitUntil(
        caches.keys() // Obtiene todos los nombres de caché actuales
            .then(cacheNames => {
                // Mapea y elimina cachés que no están en la whitelist
                return Promise.all(
                    cacheNames.map(cName => {
                        // Si el caché actual no está en la whitelist, elimínalo
                        if (!cacheWhitelist.includes(cName)) {
                            return caches.delete(cName); // Elimina el caché obsoleto
                        }
                    })
                );
            })
            .then(() => self.clients.claim())
    );
});

// Fetch (recuperar recursos desde cache o red)
self.addEventListener('fetch', (e) => {
  console.log('Service Worker: Fetching', e.request.url);
  e.respondWith(
    caches.match(e.request).then((res) => {
      return res || fetch(e.request).then((response) => {
        // Agregar recursos al caché si no están presentes
        return caches.open(cacheName).then((cache) => {
          cache.put(e.request, response.clone());
          return response;
        });
      });
    })
  );
});


// Registrar el Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then((reg) => console.log('Service Worker registrado con éxito:', reg))
      .catch((err) => console.log('Error al registrar el Service Worker:', err));
  });
}

