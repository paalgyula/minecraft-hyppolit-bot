var mineflayer = require('mineflayer');
var navigatePlugin = require('mineflayer-navigate')(mineflayer);
var blockFinderPlugin = require('mineflayer-blockfinder')(mineflayer);

var vec3 = require('vec3');

var config = require('./config');

var bot = mineflayer.createBot({
    host: config.host,
    port: 25565,
    username: config.password,
    //password: "12345678",          // online-mode=true servers
    verbose: true,
    checkTimeoutInterval: (25 * 10000) // run KeepAlive every 25 seconds
});

navigatePlugin(bot);
//blockFinderPlugin(bot);

var command = '';
var timer = null;

bot.on('login', function (message) {
    bot.chat('/login ' + config.password)
    
    setTimeout(() => {
        bot.chat('Sziasztok, RE!')
    }, 1000);
});

bot.on('end', function (msg) {
    console.error('Disconnected!');
    console.log(msg);
});


bot.on('message', function (message) {
    var regexp = /^(\[.+\])?(\s+)?(.+)(\s+?):(.*$)/g;
    message = message.toString();

    let matches = regexp.exec(message);

    if (matches != null) {
        onChat(matches[3], matches[5].trim(), matches[1]); // extracting chat :)
    } else {
        console.log("Message: " + message);
    }
});

function onChat(username, message, prefix) {
    console.log(`[CHAT] ${username}: ${message}`);

    // navigate to whoever talks
    if (username.toLowerCase().indexOf(bot.username.toLowerCase()) !== -1) return;

    var target = bot.players[username].entity;

    switch (message) {
        case 'ajto':
            command = 'ajto'
            bot.chat('Megyek, nyitom!')
            bot.navigate.to(vec3(-691.1632198494588, 64, 763.3995480580185))
            break;
    }

    if (message === 'gyere') {
        clearTimeout(timer);
        bot.navigate.to(target.position);
        console.log(target.position);
    } else if (message === 'stop') {
        bot.navigate.stop();
    }
}

bot.navigate.on('pathFound', function (path) {
    //bot.chat("found path. I can get there in " + path.length + " moves.");
});

bot.navigate.on('cannotFind', function (closestPath) {
    bot.chat("Nemtok odamenni, nem látlak!");
    bot.navigate.walk(closestPath);
});

bot.navigate.on('arrived', function () {
    if (command === 'ajto') {
        bot.chat("Gyere be, nyitva!");
        timer = setTimeout(() => {
            if (command === 'ajto') {
                bot.chat('Megyek vissza főzni!')
                command = ''
                bot.navigate.to(vec3(-672.6137045671529, 64, 775.4380482494444));
            }
        }, 4000);
    }
});

bot.navigate.on('interrupted', function () {
    //bot.chat("stopping");
});

setInterval(() => {
    bot.chat('/heal')
    console.log('Healing myself...')
}, 120000)