Push notification demo
======================

This is a simple server and demo page for sending push notifications. It works in modern Chrome and Firefox. You'll need to provide a ``config.json`` file for 
this to work, with the following info::

    {
      "tlsKey": "your TLS key location",
      "tlsCert": "TLS cert location",
      "gcm": "Your GCM server key",
      "port": 4000
    }

You should also update ``manifest.json`` with the correct GCM project ID.

