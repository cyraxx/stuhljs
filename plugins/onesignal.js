const OneSignal = require('onesignal-node');

const oneSignalChannel = function(parent, opts) {
    this.parent = parent;
    this.opts = opts;
    this.name = opts.name;
};

oneSignalChannel.prototype.broadcast = function(message, title, link, level, ttl) {
    const params = {
        contents: {
            en: message
        }
    };

    if (title) {
        params.headings = {
            en: title
        };
    }

    if (typeof ttl !== 'undefined') params.ttl = ttl;

    if (this.opts.segments) params.included_segments = this.opts.segments;
    else params.included_segments = ['All'];

    if (this.opts.iosOnly) {
        params.isIos = true;
        params.isAndroid = false;
        params.isWP = false;
        params.isAnyWeb = false;
    } else if (this.opts.androidOnly) {
        params.isAndroid = true;
        params.isIos = false;
        params.isWP = false;
        params.isAnyWeb = false;
    } else if (this.opts.windowsOnly) {
        params.isWP = true;
        params.iAndroid = false;
        params.isIos = false;
        params.isAnyWeb = false;
    } else if (this.opts.webOnly) {
        params.isAnyWeb = true;
        params.isIos = false;
        params.isAndroid = false;
        params.isWP = false;
    } else {
        params.isAndroid = true;
        params.isIos = true;
        params.isWP = true;
        params.isAnyWeb = true;
    }

    this.parent.client.createNotification(params)
        .catch(err => console.error('[OneSignal] ' + err));
};

const oneSignalPlugin = function(opts) {
    this.opts = opts;

    this.client = new OneSignal.Client(this.opts.appID, this.opts.apiKey);

    this.channels = opts.channels.map(c => new oneSignalChannel(this, c));
};

oneSignalPlugin.prototype.start = function() {
    console.log('[OneSignal] OneSignal plugin initialized');
};

module.exports = oneSignalPlugin;