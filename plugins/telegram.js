const telegram = require('node-telegram-bot-api');

const escapeHTML = function(s) {
    return s
        .replace('&', '&amp;')
        .replace('<', '&lt;')
        .replace('>', '&gt;');
};

const telegramChannel = function(parent, opts) {
    this.parent = parent;
    this.opts = opts;
    this.name = opts.name;
};

telegramChannel.prototype.broadcast = function(message, title, link) {
    let telegramMessage = escapeHTML(message);

    if (title) telegramMessage = '<b>' + escapeHTML(title) + '</b>\n' + telegramMessage;
    if (link) telegramMessage += '\n<a href="' + escapeHTML(link) + '">' + escapeHTML(link) + '</a>';

    this.parent.client.sendMessage(this.opts.channel, telegramMessage, {
        parse_mode: 'HTML'
    });
};

const telegramClient = function(opts) {
    this.opts = opts;

    this.client = new telegram(opts.token);

    this.channels = opts.channels.map(c => new telegramChannel(this, c));
};

telegramClient.prototype.start = function() {
    console.log('[Telegram] Telegram plugin initialized');
};

module.exports = telegramClient;