const { IncomingWebhook } = require('@slack/webhook');

const slackChannel = function(parent, opts) {
    this.parent = parent;
    this.opts = opts;
    this.name = opts.name;

    this.client = new IncomingWebhook(opts.webhook);
};

slackChannel.prototype.broadcast = function(message, title, link, level) {
    let line = message,
        color = '#000000';

    if (level === 'good') {
        color = 'good';
    } else if (level === 'bad') {
        color = 'danger';
    } else if (level === 'gay') {
        color = '#ff00ff';
        line = ':rainbow: ' + message + ' :rainbow:';
    }

    this.client.send({
        username: this.opts.nick,
        icon_emoji: this.opts.icon,
        attachments: [{
            title: title,
            title_link: link,
            fallback: message,
            text: line,
            color: color
        }]
    }, () => {});
};

const slackClient = function(opts) {
    this.opts = opts;
    this.channels = opts.channels.map(c => new slackChannel(this, c));
};

slackClient.prototype.start = function() {
    console.log('[Slack] Slack plugin initialized');
};

module.exports = slackClient;