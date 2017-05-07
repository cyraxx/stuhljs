# stuhl.js (Partymeister notification bot)

This bot provides the ability for [Partymeister](http://www.partymeister.org/) to broadcast certain events to several destinations, including public and/or internal IRC channels, Telegram channels, Slack, and push notifications to mobile apps via OneSignal. It exposes an HTTP endpoint that is called by Partymeister for every broadcast.

## Instructions

1. Install [node.js](https://github.com/joyent/node) and [npm](https://github.com/npm/npm).
2. Install dependencies by changing to the `stuhljs` directory and running `npm install`.
3. Copy `config.sample.json` to `config.json` and adjust settings as needed.
4. Run `node stuhl.js`.
5. Configure the HTTP address and key in Partymeister.

**Note:** You can provide the name of an alternative configuration file as a command line parameter to load instead of `config.json`.

## Configuration

The configuration file consists of plugins, channels, and destinations. Each plugin corresponds to one service the bot connects to, such as IRC or Slack. For each plugin any number of channels can be defined. The meaning of what a channel is varies depending on the plugin: For the IRC plugin, each channel corresponds to an IRC channel the bot should join. For the OneSignal plugin, each channel is a configurable segment of app users.

Destinations are logical groupings of channels. The idea here is to create one destination for each kind of message (such as general announcements, deadlines, orga internal information, etc.) and then map them to the channels that this specific kind of message should be sent to. That way the mapping can later be changed without having to reconfigure Partymeister.

See the sample file `config.sample.json` for examples.

## Web frontend

If the configuration option `enableFrontend` is set to `true`, accessing the service from a (reasonably modern) web browser will show a simple frontend allowing you to send notifications.

## HTTP API

Notifications are sent by posting a JSON object to `/stuhl` containing the following properties:
* `key`: Needs to match the access key in the configuration file
* `destination`: Name of the destination this notification should be sent to
* `message`: Notification content
* `title`: Optional heading of the notification
* `link`: Optional link associated with the notification
* `level`: Optional message level (`good`, `bad`, `boring`) that controls how the notification is displayed (not supported by all plugins)
* `ttl`: Optional integer defining the time in seconds until this notification should be considered expired (currently only supported by OneSignal plugin)

The HTTP response is a JSON object that contains the boolean field `success` and an `error` string if applicable.

## Writing your own plugin

Each plugin is a file in the `plugins` directory that exports a class supporting the following:
* Constructor: Gets the plugin's configuration file section as its single argument
* `start()` method: Causes the plugin to start running, establish network connections, etc.
* `channels`property: Array of channel objects (see below)

Every channel object needs to have:
* `name` property: The channel name, as set in the configuration file
* `broadcast(message, title, link, level, ttl)` method: Broadcasts a message to this channel
