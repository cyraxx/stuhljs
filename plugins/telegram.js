const { Client } = require('@telegraf/client');

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

    if (title) telegramMessage = `<b>${escapeHTML(title)}</b>\n\n${telegramMessage}`;
    if (link) telegramMessage += `\n\n▶ <a href="${escapeHTML(link)}">${escapeHTML(link)}</a>`;

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