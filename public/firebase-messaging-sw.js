importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging.js');

firebase.initializeApp({
  apiKey: 'AIzaSyCYVFKDq52Ndq_OyXbRbvwBn-49cQZ3ij4',
  authDomain: 'traduler.firebaseapp.com',
  projectId: 'traduler',
  storageBucket: 'traduler.appspot.com',
  messagingSenderId: '136663781474',
  appId: '1:136663781474:web:a2288251716d0d81ca413b',
});

self.addEventListener('push', (event) => {
  let payload;
  try {
    payload = event.data.json();
  } catch (error) {
    console.error('Push data parsing error:', error);
    return;
  }

  const { notification, data } = payload;
  if (!notification) {
    console.log('No notification data in push event');
    return;
  }

  const options = {
    body: notification.body || 'No body',
    icon: notification.icon || '/images/android/android-launchericon-144-144.png',
    image: notification.image || '/images/android/android-launchericon-144-144.png',
    data: {
      click_action: data?.click_action || '/',
    },
  };

  event.waitUntil(
    self.registration.showNotification(notification.title || 'Notification', options),
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const urlToOpen = event.notification.data.click_action;

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      let matchingClient = null;

      for (let i = 0; i < windowClients.length; i++) {
        const windowClient = windowClients[i];
        if (windowClient.url.includes(urlToOpen)) {
          matchingClient = windowClient;
          break;
        }
      }

      if (matchingClient) return matchingClient.focus();
      else return clients.openWindow(urlToOpen);
    }),
  );
});
