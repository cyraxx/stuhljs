# stuhl.js (Partymeister IRC bot)

This IRC bot provides the ability for [Partymeister](http://www.partymeister.org/) to broadcast certain events to a party's public and/or internal IRC channel. It exposes an HTTP endpoint that is called by Partymeister for every broadcast.

## Instructions

1. Install [node.js](https://github.com/joyent/node) and [npm](https://github.com/npm/npm).
2. Install dependencies by changing to the `stuhljs` directory and running `npm install`.
3. Copy `config.sample.json` to `config.json` and adjust settings as needed. (Note: If you want the bot to join only the public or only the internal channel, simply leave the other channel name blank.)
4. Run `node stuhl.js`. It should connect to IRC and join the proper channels.
5. Configure the HTTP address and key in Partymeister.

**Note:** Every configuration option from `config.json` can be overridden by supplying a command line argument with the same name. Example: `node stuhl.js --nick=superstuhl`

## To-Do list

* Make HTTP port and binding address configurable
* Implement proper error handling (right now pretty much anything will simply lead to an unhandled exception)
* Possibly document the HTTP API (although it's really only relevant to Partymeister)