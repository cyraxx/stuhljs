var telegram = require('node-telegram-bot-api');

var telegramClient = function(opts) {
    var self = this;
    this.opts = opts;

    this.client = new telegram(opts.token);

    this.channels = opts.channels.map(function(c) {
        return new telegramChannel(self, c);
    });
};

telegramClient.prototype.start = function() {
    console.log('[Telegram] Telegram plugin initialized');
};

var telegramChannel = function(parent, opts) {
    this.parent = parent;
    this.opts = opts;
    this.name = opts.name;
};

var escapeHTML = function(s) {
    return s
        .replace('&', '&amp;')
        .replace('<', '&lt;')
        .replace('>', '&gt;');
};

telegramChannel.prototype.broadcast = function(message, title, link, level) {
    var telegramMessage = escapeHTML(message);

    if (title) telegramMessage = '<b>' + escapeHTML(title) + '</b>\n' + telegramMessage;
    if (link) telegramMessage += '\n<a href="' + escapeHTML(link) + '">' + escapeHTML(link) + '</a>';

    this.parent.client.sendMessage(this.opts.channel, telegramMessage, {
        parse_mode: 'HTML'
    });
};

module.exports = telegramClient;