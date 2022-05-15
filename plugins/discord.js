const Discord = require('discord.js');
const markdownEscape = require('markdown-escape');

const discordChannel = function(parent, opts) {
    this.parent = parent;
    this.opts = opts;
    this.name = opts.name;
};

discordChannel.prototype.broadcast = function(message, title, link) {
    const chan = this.parent.client.channels.cache.get(this.opts.channelID);
    if (!chan) {
        console.log(`[Discord] Error: Channel ${this.opts.channelID} not found`);
        return;
    }

    let msg = markdownEscape(message);
    if (title) msg = `**${markdownEscape(title)}**\n\n${msg}`;
    if (link) msg += `\n\n:arrow_forward: ${link}`;

    try {
        chan.send(msg);
    } catch (e) {
        console.log(`Discord] Error: ${e}`);
    }
};

const discordClient = function(opts) {
    this.opts = opts;

    this.client = new Discord.Client({ intents: [Discord.Intents.FLAGS.GUILDS] });
    this.client.on('ready', () => console.log(`[Discord] Discord client logged in as ${this.client.user.tag}`));
    this.client.on('reconnecting', () => console.log('[Discord] Discord client reconnecting'));
    this.client.on('error', err => console.log(`[Discord] ${err}`));

    this.channels = opts.channels.map(c => new discordChannel(this, c));
};

discordClient.prototype.start = function() {
    this.client.login(this.opts.token)
        .catch(err => console.log(`[Discord] Login error: ${err}`));
};

module.exports = discordClient;
