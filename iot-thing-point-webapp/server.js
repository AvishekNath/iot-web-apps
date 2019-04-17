const express = require('express');
const path = require('path');
const app = express();

let clientId = 0;
let clients = {}; // <- Keep a map of attached clients

app.use(express.static(path.join(__dirname, 'build')));

// Called once for each new client. Note, this response is left open!
app.get('/events/', function (req, res) {
	req.socket.setTimeout(Number.MAX_VALUE);
	let topicName = req.query.topic;
	console.log(topicName);
	res.writeHead(200, {
		'Content-Type': 'text/event-stream', // <- Important headers
		'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  
	res.write('\n');
	(function (clientId) {
		clients[clientId] = res; // <- Add this client to those we consider "attached"
		req.on("close", function () {
			delete clients[clientId]
		}); // <- Remove this client when he disconnects
	})(++clientId); 
});

app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

setInterval(function () {
	var msg = Math.floor(Math.random() * 100) + 1; // 1 to 100
	console.log("Clients: " + Object.keys(clients) + " <- " + msg);
	for (clientId in clients) {
		clients[clientId].write("data: " + msg + "\n\n"); // <- Push a message to a single attached client
	}
}, 2000);

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});