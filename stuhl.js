#!/usr/bin/env node

var bodyParser = require('body-parser'),
    color = require('irc-colors'),
    express = require('express'),
    fs = require('fs'),
    irc = require('irc'),
    optimist = require('optimist');

if (!fs.existsSync('config.json')) {
    console.error('config.json not found. Create one using config.sample.json as a template.');
    process.exit(1);
}

var opts = require('./config.json');

var args = optimist.argv;
Object.keys(args).forEach(function(arg) {
    if (opts.hasOwnProperty(arg)) opts[arg] = args[arg];
});

var isReady = false;

var client = new irc.Client(opts.server, opts.nick, {
    userName: opts.userName,
    realName: opts.realName,
    autoConnect: true,
    autoRejoin: true,
    showErrors: true
});

client.on('registered', function() {
    opts.nick = client.nick;
    console.log('Connected to %s as %s', opts.server, opts.nick);

    if (opts.orgaChannel) {
        var channelWithKey = opts.orgaChannel;
        if (opts.orgaChannelKey) channelWithKey += ' ' + opts.orgaChannelKey;
        client.join(channelWithKey);
    }

    if (opts.publicChannel) client.join(opts.publicChannel);
});

client.on('join', function(channel, nick, message) {
    if (nick == opts.nick) {
        console.log('Joined %s', channel);
        isReady = true;
    }
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
    if (destination != 'orga' && destination != 'public' && destination != 'all') {
        res.status(400).json({
            success: false,
            error: 'Invalid destination'
        });
        return;
    }

    if (!isReady) {
        res.status(500).json({
            success: false,
            error: 'No IRC connection'
        });
        return;
    }

    var line = message;

    var level = req.body.level;
    if (level == 'good') line = color.green(line);
    else if (level == 'bad') line = color.red(line);
    else if (level == 'gay') line = color.rainbow(line);

    if ((destination == 'orga' || destination == 'all') && opts.orgaChannel) client.say(opts.orgaChannel, line);
    if ((destination == 'public' || destination == 'all') && opts.publicChannel) client.say(opts.publicChannel, line);

    res.json({
        success: true
    });
});

var server = app.listen(3000, function() {
    var address = server.address();
    console.log('Der sTUHL läuft! http://%s:%s', address.address, address.port);
});