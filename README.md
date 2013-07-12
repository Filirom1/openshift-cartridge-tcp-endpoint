# openshift-cartridge-tcp-endpoint

How to connect in TCP to your deployed application in Openshift.

Use with http://cartreflect-claytondev.rhcloud.com/reflect?github=Filirom1/openshift-cartridge-tcp-endpoint

Declare a new TCP port in `manifest/metadata.yml`: 

    Cartridge-Short-Name: NODEJS
    Endpoints:
      - Private-IP-Name:   IP
        Private-Port-Name: PORT
        Private-Port:      8080
        Public-Port-Name:  PROXY_PORT
        Mappings:
          - Frontend:      ""
            Backend:       ""
            Options:       { websocket: true }
          - Frontend:      "/health"
            Backend:       ""
            Options:       { health: true }
      - Private-IP-Name:   IP
        Private-Port-Name: PORT_TCP
        Private-Port:      8090
        Public-Port-Name:  PROXY_PORT_TCP
        Options:           { "ssl_to_gear": true }

https://github.com/Filirom1/openshift-cartridge-tcp-endpoint/blob/master/metadata/manifest.yml#L43

* `OPENSHIFT_NODEJS_PORT_TCP` is the private port, you application will listen on.
* `OPENSHIFT_NODEJS_PROXY_PORT_TCP` is the public port, you client will connect to.


Create a TCP server, and make it listen on `OPENSHIFT_NODEJS_PORT_TCP`. Replace NODEJS by your Cartridge-Shot-Name.

NodeJs example : 

    var net = require('net');
    var tcpServer = net.createServer(function(c) { //'connection' listener
      console.log('server connected');
      c.on('end', function() {
        console.log('server disconnected');
      });
      c.write('hello\r\n');
      c.pipe(c);
    });
    
    tcpServer.listen(process.env.OPENSHIFT_NODEJS_PORT_TCP, process.env.OPENSHIFT_NODEJS_IP, function() { //'listening' listener
      console.log('server bound');
    });

https://github.com/Filirom1/openshift-cartridge-tcp-endpoint/blob/master/template/server.js#L18


Now you will have to create an HTTP serveur to publish the `OPENSHIFT_NODEJS_PROXY_PORT_TCP` for your TCP clients.

NodeJs example : 

    var http = require('http');
    var os = require('os');
    
    http.createServer(function (req, res) {
      res.writeHead(200, {'Content-Type': 'text/plain'});
      res.write('TCP port available at:\n');
      res.end('telnet  ' + os.hostname() + ' ' + process.env.OPENSHIFT_NODEJS_PROXY_PORT_TCP+ '\n');
    }).listen(process.env.OPENSHIFT_NODEJS_PORT, process.env.OPENSHIFT_NODEJS_IP);

https://github.com/Filirom1/openshift-cartridge-tcp-endpoint/blob/master/template/server.js#L2


Note that `OPENSHIFT_NODEJS_PROXY_PORT_TCP` may change if the OpenShift admin move your gear.
