#!/usr/bin/env node

const
    bodyParser = require('body-parser'),
    express = require('express'),
    fs = require('fs'),
    https = require('https');

let configName = process.argv.length > 2 ? process.argv[2] : 'config.json';

if (!fs.existsSync(configName)) {
    console.error('Configuration file %s not found', configName);
    process.exit(1);
}

if (!configName.match(/^[./]/)) configName = './' + configName;

const
    opts = require(configName),
    plugins = [],
    channels = {};

opts.plugins.forEach(pluginOpts => {
    const pluginClass = require('./plugins/' + pluginOpts.plugin);
    const plugin = new pluginClass(pluginOpts);

    plugin.channels.forEach(channel => {
        if (channels[channel.name]) {
            console.error('Configuration error: Duplicate channel %s', channel.name);
            process.exit(1);
        }
        channels[channel.name] = channel;
    });

    plugins.push(plugin);
});

Object.keys(opts.destinations).forEach(destination => {
    opts.destinations[destination].forEach(destinationChannel => {
        if (!channels[destinationChannel]) {
            console.error('Configuration error: Destination %s references invalid channel %s',
                destination, destinationChannel);
            process.exit(1);
        }
    });
});

console.log('[sTUHL] Loaded %d destinations and %d channels',
    Object.keys(opts.destinations).length, Object.keys(channels).length);

plugins.forEach(plugin => plugin.start());

const app = express();
app.use(bodyParser.json());

if (opts.frontendEnabled) {
    app.use(express.static('frontend'));
    app.get('/destinations', (req, res) => res.json(Object.keys(opts.destinations)));
} else {
    app.get('/', (req, res) => res.send('Das ist ja sTUHL!'));
}

app.get('/stuhl', (req, res) => res.status(405).json({
    success: false,
    error: 'Use POST'
}));

app.post('/stuhl', (req, res) => {
    const key = req.body.key;
    if (key !== opts.key) {
        res.status(403).json({
            success: false,
            error: 'Invalid key'
        });
        return;
    }

    const message = req.body.message;
    if (!message) {
        res.status(400).json({
            success: false,
            error: 'Missing message'
        });
        return;
    }

    const destination = req.body.destination;
    if (!opts.destinations[destination]) {
        res.status(400).json({
            success: false,
            error: 'Invalid destination'
        });
        return;
    }

    const ttl = req.body.ttl;
    if (typeof ttl !== 'undefined' && !Number.isInteger(ttl)) {
        res.status(400).json({
            success: false,
            error: 'Invalid TTL'
        });
        return;
    }

    opts.destinations[destination].forEach(destinationChannel =>
        channels[destinationChannel].broadcast(message, req.body.title, req.body.link, req.body.level, req.body.ttl));

    console.log('[sTUHL] Message broadcast to destination %s: %s', destination, message);

    res.json({
        success: true
    });
});

const listener = opts.tls ? https.createServer({
    key: fs.readFileSync(opts.tls.key),
    cert: fs.readFileSync(opts.tls.cert)
}, app) : app;

const server = listener.listen(3000, '::', () => {
    const address = server.address();
    console.log('[sTUHL] Der sTUHL läuft! %s://%s:%s', opts.tls ? 'https' : 'http', address.address, address.port);
});