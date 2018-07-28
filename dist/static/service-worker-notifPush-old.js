'use strict';

self.addEventListener('push', function(event) {
    console.log('[Service Worker] Push Received.');
    console.log(`[Service Worker] Push had this data: "${event.data.text()}"`);

    const title = 'La résidence connectée - Notification';
    const options = {
        body: 'Cliquez sur la notification pour en voir le contenu',
        icon: 'img/icons/logo192.png',
        badge: 'img/icons/logo192.png'
    };
    const notificationPromise = self.registration.showNotification(title, options);
    event.waitUntil(notificationPromise);

    self.addEventListener('notificationclick', function(event) {
        console.log('[Service Worker] Notification click Received.');

        event.notification.close();

        event.waitUntil(
            clients.openWindow('http://modimo.herokuapp.com')
        );
    });
});