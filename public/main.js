var send = document.querySelector(".send");
var checkbox = document.querySelector("input");

if (!("serviceWorker" in navigator)) {
  var label = document.querySelector("label");
  label.innerHTML = "Notifications not supported";
  checkbox.disabled = true;
} else {
  navigator.serviceWorker.ready.then(function(r) {
    var subscription = null;

    r.pushManager.getSubscription({ userVisibleOnly: true }).then(function(sub) {
      checkbox.checked = !!sub;
      subscription = sub;
    });    
  
    checkbox.addEventListener("click", function() {
      if (checkbox.checked) {
        r.pushManager.subscribe({ userVisibleOnly: true }).then(function(sub) {
          console.log(sub);
          subscription = sub;
          var xhr = new XMLHttpRequest();
          var endpoint = encodeURIComponent(sub.endpoint);
          var key = btoa(String.fromCharCode.apply(null, new Uint8Array(sub.getKey("p256dh"))));
          xhr.open("GET", `/register?endpoint=${endpoint}&key=${key}`);
          xhr.send();
        });
      } else {
        r.pushManager.getSubscription().then(sub => sub.unsubscribe());
        var xhr = new XMLHttpRequest();
        xhr.open("GET", `/unregister?endpoint=${subscription.endpoint}`);
        xhr.send();
      }
    });
    
    send.addEventListener("click", function() {
      var xhr = new XMLHttpRequest();
      xhr.open("GET", "/send");
      xhr.send();
    });
  });
  
  navigator.serviceWorker.register("sw.js");
}
