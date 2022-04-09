const
    irc = require('irc'),
    color = require('irc-colors');

const ircChannel = function(parent, opts) {
    this.parent = parent;
    this.opts = opts;
    this.name = opts.name;
};

ircChannel.prototype.join = function() {
    let channelWithKey = this.opts.channel;
    if (this.opts.key) channelWithKey += ' ' + this.opts.key;
    this.parent.client.join(channelWithKey);
};

ircChannel.prototype.broadcast = function(message, title, link, level) {
    let ircLine = title ? color.bold(title + ':') + ' ' + message : message;

    if (level === 'good') {
        ircLine = color.green(ircLine);
    } else if (level === 'bad') {
        ircLine = color.red(ircLine);
    } else if (level === 'gay') {
        ircLine = color.rainbow(ircLine);
    }

    if (link) ircLine += ' [' + link + ']';

    this.parent.client.say(this.opts.channel, ircLine);
};

const ircClient = function(opts) {
    this.opts = opts;

    this.client = new irc.Client(opts.server, opts.nick, {
        port: opts.port || 6667,
        userName: opts.userName,
        realName: opts.realName,
        autoConnect: false,
        autoRejoin: true,
        showErrors: true,
        secure: !!opts.secure,
        selfSigned: !!opts.acceptAllCerts,
        certExpired: !!opts.acceptAllCerts
    });

    this.client.on('registered', () => this.onRegister());
    this.client.on('join', (channel, nick) => this.onJoin(channel, nick));

    this.channels = opts.channels.map(c => new ircChannel(this, c));
};

ircClient.prototype.start = function() {
    console.log('[IRC] Connecting to %s', this.opts.server);
    this.client.connect();
};

ircClient.prototype.onRegister = function() {
    this.opts.nick = this.client.nick;
    console.log('[IRC] Connected to %s as %s', this.opts.server, this.opts.nick);

    this.channels.forEach(channel => channel.join());
};

ircClient.prototype.onJoin = function(channel, nick) {
    if (nick === this.opts.nick) console.log('[IRC] Joined %s', channel);
};

module.exports = ircClient;