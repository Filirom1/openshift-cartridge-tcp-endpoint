var net = require('net');
var conf = {port: process.env.OPENSHIFT_NODEJS_PORT_TCP, host: process.env.OPENSHIFT_NODEJS_IP};
console.log(conf);
var server = net.createServer(function(c) { //'connection' listener
  console.log('server connected');
  c.on('end', function() {
    console.log('server disconnected');
  });
  c.write('hello\r\n');
  c.pipe(c);
});
server.listen(conf.port, conf.host, function() { //'listening' listener
  console.log('server bound');
});
