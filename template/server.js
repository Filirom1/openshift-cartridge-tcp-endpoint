var net = require('net');
var http = require('http');
var dns = require('dns');
var os = require('os');

var ip;
dns.resolve4(os.hostname(), function(err, ips){
  ip = ips[0];
});

http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.write('TCP port available at:\n');
  res.end('telnet  ' + ip + ' ' + process.env.OPENSHIFT_NODEJS_PROXY_PORT_TCP+ '\n');
}).listen(process.env.OPENSHIFT_NODEJS_PORT, process.env.OPENSHIFT_NODEJS_IP);


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


