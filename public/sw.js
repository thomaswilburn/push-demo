self.addEventListener("push", function(e) {
  e.waitUntil(self.registration.showNotification("Click here!", {
    body: "Read more at The Seattle Times"
  }));
});

self.addEventListener("notificationclick", function() {
  clients.openWindow("http://seattletimes.com");
});
