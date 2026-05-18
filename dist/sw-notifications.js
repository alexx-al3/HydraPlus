// Service Worker for push notifications
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', () => self.clients.claim());

self.addEventListener('push', (event) => {
  const data = event.data?.json() || {};
  event.waitUntil(
    self.registration.showNotification(data.title || 'Hydra+ 💧', {
      body: data.body || 'Hora de beber água!',
      icon: '/icons/icon-192.png',
      badge: '/icons/icon-192.png',
      vibrate: [100, 50, 100],
      data: { url: '/' },
      actions: [
        { action: 'drink', title: '💧 Bebi água!' },
        { action: 'later', title: '⏰ Depois' }
      ]
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  if (event.action === 'drink') {
    event.waitUntil(clients.openWindow('/?action=drink'));
  } else {
    event.waitUntil(clients.openWindow('/'));
  }
});
