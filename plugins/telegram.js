const { Client } = require('@telegraf/client');
const { escape } = require('html-escaper');

const telegramChannel = function(parent, opts) {
    this.parent = parent;
    this.opts = opts;
    this.name = opts.name;
};

telegramChannel.prototype.broadcast = function(message, title, link) {
    let telegramMessage = escape(message);

    if (title) telegramMessage = `<b>${escape(title)}</b>\n\n${telegramMessage}`;
    if (link) telegramMessage += `\n\n▶ <a href="${escape(link)}">${escape(link)}</a>`;

    this.parent.client.call('sendMessage', {
        chat_id: this.opts.channel,
        text: telegramMessage,
        parse_mode: 'HTML'
    });
};

const telegramClient = function(opts) {
    this.opts = opts;

    this.client = new Client(opts.token);

    this.channels = opts.channels.map(c => new telegramChannel(this, c));
};

telegramClient.prototype.start = function() {
    console.log('[Telegram] Telegram plugin initialized');
};

module.exports = telegramClient;