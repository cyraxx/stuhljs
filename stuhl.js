#!/usr/bin/env node

var bodyParser = require('body-parser'),
    express = require('express'),
    fs = require('fs');

var configName = process.argv.length > 2 ? process.argv[2] : 'config.json';

if (!fs.existsSync(configName)) {
    console.error('Configuration file %s not found', configName);
    process.exit(1);
}

if (!configName.match(/^[\.\/]/)) configName = './' + configName;

var opts = require(configName),
    plugins = [],
    channels = {};

for (var pluginOpts of opts.plugins) {
    var pluginClass = require('./plugins/' + pluginOpts.plugin),
        plugin = new pluginClass(pluginOpts);

    for (var channel of plugin.channels) {
        if (channels[channel.name]) {
            console.error('Configuration error: Duplicate channel %s', channel.name);
            process.exit(1);
        }
        channels[channel.name] = channel;
    }

    plugins.push(plugin);
}

for (var destination in opts.destinations) {
    for (var destinationChannel of opts.destinations[destination]) {
        if (!channels[destinationChannel]) {
            console.error('Configuration error: Destination %s references invalid channel %s', destination, destinationChannel);
            process.exit(1);
        }
    }
}

console.log('[sTUHL] Loaded %d destinations and %d channels', Object.keys(opts.destinations).length, Object.keys(channels).length);

plugins.forEach(function(plugin) {
    plugin.start();
});

var app = express();
app.use(bodyParser.json());

app.get('/', function(req, res) {
    res.send('Das ist ja sTUHL!');
});

app.get('/stuhl', function(req, res) {
    res.status(405).json({
        success: false,
        error: 'Use POST'
    });
});

app.post('/stuhl', function(req, res) {
    var key = req.body.key;
    if (key != opts.key) {
        res.status(403).json({
            success: false,
            error: 'Invalid key'
        });
        return;
    }

    var message = req.body.message;
    if (!message) {
        res.status(400).json({
            success: false,
            error: 'Missing message'
        });
        return;
    }

    var destination = req.body.destination;
    if (!opts.destinations[destination]) {
        res.status(400).json({
            success: false,
            error: 'Invalid destination'
        });
        return;
    }

    var ttl = req.body.ttl;
    if (typeof ttl !== 'undefined' && !Number.isInteger(ttl)) {
        res.status(400).json({
            success: false,
            error: 'Invalid TTL'
        });
        return;
    }

    for (var destinationChannel of opts.destinations[destination]) {
        channels[destinationChannel].broadcast(message, req.body.title, req.body.link, req.body.level, req.body.ttl);
    }

    console.log('[sTUHL] Message broadcast to destination %s: %s', destination, message);

    res.json({
        success: true
    });
});

var server = app.listen(3000, '::', function() {
    var address = server.address();
    console.log('[sTUHL] Der sTUHL läuft! http://%s:%s', address.address, address.port);
});