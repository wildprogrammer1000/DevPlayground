self.addEventListener('push', (event) => {
  console.log('Push received.');
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'Default title';
  const options = {
    body: data.body || 'Default body',
    icon: data.icon || '/logo_256.png',
  };

  event.waitUntil(self.registration.showNotification(title, options));
});