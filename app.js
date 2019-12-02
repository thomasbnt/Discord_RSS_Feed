const Discord = require('discord.js')
const config = require('./config.json')
const colors = require("colors")
const randomcolor = require('randomcolor')

const truncate = function (str, length, ending) {
    if (length == null) {length = 100}
    if (ending == null) {ending = '...'}
    if (str.length > length) {
        return str.substring(0, length - ending.length) + ending
    } else {
        return str
    }
}
const { prefix, WebhookRedditRSS } = config
const WebhookRedditRSSc = new Discord.WebhookClient(WebhookRedditRSS.id, WebhookRedditRSS.token)

const Watcher  = require('feed-watcher'),
    feed = 'https://www.reddit.com/r/all.rss',
    interval = 10

const watcher = new Watcher(feed, interval)

const bot = new Discord.Client({
    autoReconnect: true
})

// ---------------------- Ready ----------------------
bot.on('ready', async ()  =>  {    
    watcher.start()
        .then(function(entries) {})
        .catch(function(error) { console.log(logSymbols.error, error)})
    watcher.on('new entries', function(entries) {
        entries.forEach(function(entry) {           
            WebhookRedditRSSc.send(`[${entry.title}](${entry.link}) — Posté par ${entry.author}`)
            console.log('New entry \nTitle : ' + entry.title + 
            "\nURL : " + (entry.url || entry.link) + "\n\n")
        })
    })
    console.log(" Connected to ".bgMagenta + bot.user.tag.bgMagenta + "\n")
})
function updatePresence() {
    bot.user.setActivity("a feeeeeeed", {type: "WATCHING"})
}

// ---------------------- Messages ----------------------
bot.on('message', (msg) => { 

    if (msg.author.bot) return
    if(msg.channel.recipient) return

})

bot.login(config.token)
    .catch(e => console.error(e.message))
