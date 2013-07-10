var net = require('net');
var client = net.connect({port: process.env.OPENSHIFT_NODEJS_PORT_TCP, host: process.env.OPENSHIFT_NODEJS_IP}, function() { //'connect' listener
  console.log('client connected');
  client.write('world!\r\n');
});
client.on('data', function(data) {
  client.write(data.toString());
});
client.on('end', function() {
  console.log('client disconnected');
  client.end();
});
