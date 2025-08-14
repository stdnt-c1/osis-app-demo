const CACHE_NAME = 'osis-smkn7-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/admin/login.html',
  '/admin/dashboard.html',
  '/assets/css/main.css',
  '/assets/css/admin-main.css',
  '/assets/css/admin/_login.css',
  '/assets/js/public/app.js',
  '/assets/js/public/finance.js',
  '/assets/js/public/gallery.js',
  '/assets/js/public/navigation.js',
  '/assets/js/public/news.js',
  '/assets/js/public/slider.js',
  '/assets/js/public/suggestions.js',
  '/assets/js/public/utils.js',
  '/assets/js/admin/app.js',
  '/assets/js/admin/auth.js',
  '/assets/js/admin/berita.js',
  '/assets/js/admin/finance.js',
  '/assets/js/admin/forms.js',
  '/assets/js/admin/gallery.js',
  '/assets/js/admin/modals.js',
  '/assets/js/admin/navigation.js',
  '/assets/js/admin/overview.js',
  '/assets/js/admin/vercel-blob.js',
  '/assets/js/admin/suggestions.js',
  '/assets/js/admin/supabase.js',
  '/assets/js/admin/users.js',
  '/assets/js/admin/utils.js',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css',
  'https://cdn.jsdelivr.net/npm/chart.js',
  'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2',
  'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap',
  'https://fonts.gstatic.com'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});