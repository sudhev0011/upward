importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyB1epSNaUKRxDH8V1wKPtcMfwBwMaptP5w",
  authDomain: "upward-9f8c8.firebaseapp.com",
  projectId: "upward-9f8c8",
  storageBucket: "upward-9f8c8.firebasestorage.app",
  messagingSenderId: "776177392680",
  appId: "1:776177392680:web:3a95c38d5c9bc249e1691d"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);

  const notificationTitle = payload.data.title;
  const notificationOptions = {
    body: payload.data.body,
    icon: '/favicon.png', 
    data: payload.data,  
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});


self.addEventListener('notificationclick', function(event) {
  console.log('[firebase-messaging-sw.js] Notification clicked: ', event.notification);
  
  event.notification.close();

  const targetUrl = self.location.origin; 

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then(function(windowClients) {
        for (let i = 0; i < windowClients.length; i++) {
          const client = windowClients[i];
          if (client.url.startsWith(targetUrl) && 'focus' in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(`${targetUrl}/client/dashboard`);
        }
      })
  );
});