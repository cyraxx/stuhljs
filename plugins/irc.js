var irc = require('irc'),
    color = require('irc-colors');

var ircClient = function(opts) {
    var self = this;
    this.opts = opts;

    this.client = new irc.Client(opts.server, opts.nick, {
        userName: opts.userName,
        realName: opts.realName,
        autoConnect: false,
        autoRejoin: true,
        showErrors: true
    });

    this.client.on('registered', function() {
        self.onRegister();
    });

    this.client.on('join', function(channel, nick) {
        self.onJoin(channel, nick);
    });

    this.channels = opts.channels.map(function(c) {
        return new ircChannel(self, c);
    });
};

ircClient.prototype.start = function() {
    console.log('[IRC] Connecting to %s', this.opts.server);
    this.client.connect();
};

ircClient.prototype.onRegister = function() {
    this.opts.nick = this.client.nick;
    console.log('[IRC] Connected to %s as %s', this.opts.server, this.opts.nick);

    for (var channel of this.channels) {
        channel.join();
    }
};

ircClient.prototype.onJoin = function(channel, nick) {
    if (nick == this.opts.nick) console.log('[IRC] Joined %s', channel);
};

var ircChannel = function(parent, opts) {
    this.parent = parent;
    this.opts = opts;
    this.name = opts.name;
};

ircChannel.prototype.join = function() {
    var channelWithKey = this.opts.channel;
    if (this.opts.key) channelWithKey += ' ' + this.opts.key;
    this.parent.client.join(channelWithKey);
};

ircChannel.prototype.broadcast = function(message, title, link, level) {
    var ircLine = title ? color.bold(title + ':') + ' ' + message : message;

    if (level == 'good') {
        ircLine = color.green(ircLine);
    } else if (level == 'bad') {
        ircLine = color.red(ircLine);
    } else if (level == 'gay') {
        ircLine = color.rainbow(ircLine);
    }

    if (link) ircLine += ' [' + link + ']';

    this.parent.client.say(this.opts.channel, ircLine);
};

module.exports = ircClient;