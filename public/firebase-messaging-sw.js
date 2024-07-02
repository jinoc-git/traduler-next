importScripts('https://www.gstatic.com/firebasejs/9.0.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.2/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'AIzaSyCYVFKDq52Ndq_OyXbRbvwBn-49cQZ3ij4',
  authDomain: 'traduler.firebaseapp.com',
  projectId: 'traduler',
  storageBucket: 'traduler.appspot.com',
  messagingSenderId: '136663781474',
  appId: '1:136663781474:web:a2288251716d0d81ca413b',
});

self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json().data;
    const options = {
      body: data.body,
      icon: '/images/android/android-launchericon-192-192.png',
      image: '/images/android/android-launchericon-192-192.png',
      data: {
        click_action: data.click_action,
      },
    };

    event.waitUntil(self.registration.showNotification(data.title, options));
  } else {
    console.log('This push event has no data.');
  }
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const urlToOpen = event.notification.data.click_action;

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      if (clientList.length > 0) {
        let client = clientList[0];
        for (let i = 0; i < clientList.length; i++) {
          if (clientList[i].focused) {
            client = clientList[i];
          }
        }
        return client.focus();
      }
      return self.clients.openWindow(urlToOpen);
    }),
  );
});
