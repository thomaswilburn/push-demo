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
      subscription = sub.endpoint.match(/send\/(.+)/)[1];
    });    
  
    checkbox.addEventListener("click", function() {
      if (checkbox.checked) {
        r.pushManager.subscribe({ userVisibleOnly: true }).then(function(sub) {
          subscription = sub.endpoint.match(/send\/(.+)/)[1];
          var xhr = new XMLHttpRequest();
          xhr.open("GET", `/register?id=${subscription}`);
          xhr.send();
        });
      } else {
        r.pushManager.getSubscription().then(sub => sub.unsubscribe());
        var xhr = new XMLHttpRequest();
        xhr.open("GET", `/unregister?id=${subscription}`);
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
