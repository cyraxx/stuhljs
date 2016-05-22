var slack = require('slack-node');

var slackClient = function(opts) {
    var self = this;
    this.opts = opts;

    this.channels = opts.channels.map(function(c) {
        return new slackChannel(self, c);
    });
};

slackClient.prototype.start = function() {
    console.log('[Slack] Slack plugin initialized');
};

var slackChannel = function(parent, opts) {
    this.parent = parent;
    this.opts = opts;
    this.name = opts.name;

    this.client = new slack();
    this.client.setWebhook(opts.webhook);
};

slackChannel.prototype.broadcast = function(message, title, link, level) {
    var line = message,
        color = '#000000';

    if (level == 'good') {
        color = 'good';
    } else if (level == 'bad') {
        color = 'danger';
    } else if (level == 'gay') {
        color = '#ff00ff';
        line = ':rainbow: ' + message + ' :rainbow:';
    }

    this.client.webhook({
        username: this.opts.nick,
        icon_emoji: this.opts.icon,
        attachments: [{
            title: title,
            title_link: link,
            fallback: message,
            text: line,
            color: color
        }]
    }, function() {});
};

module.exports = slackClient;