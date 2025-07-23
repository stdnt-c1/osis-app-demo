export function initializePushNotifications() {
    // Check for service worker and push API support
    if ('serviceWorker' in navigator && 'PushManager' in window) {
        console.log('Service Worker and Push API supported');

        // Request notification permission
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                console.log('Notification permission granted.');
                subscribeUser();
            } else {
                console.warn('Notification permission denied.');
            }
        });
    } else {
        console.warn('Push notifications are not supported in this browser.');
    }
}

function subscribeUser() {
    navigator.serviceWorker.ready.then(registration => {
        const subscribeOptions = {
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(
                'YOUR_PUBLIC_VAPID_KEY' // Replace with your actual VAPID key
            )
        };

        return registration.pushManager.subscribe(subscribeOptions);
    })
    .then(pushSubscription => {
        console.log('Received PushSubscription:', JSON.stringify(pushSubscription));
        // Here you would send the subscription to your backend server
        // sendSubscriptionToBackend(pushSubscription);
    })
    .catch(error => {
        console.error('Error subscribing to push:', error);
    });
}

function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

// Simulated function to send a push notification (for testing purposes)
export function simulatePushNotification(title, body) {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
        navigator.serviceWorker.ready.then(registration => {
            registration.showNotification(title, {
                body: body,
                icon: 'assets/icons/icon-192x192.png',
                badge: 'assets/icons/icon-192x192.png'
            });
        });
    } else {
        console.warn('Push notifications are not supported for simulation.');
    }
}
