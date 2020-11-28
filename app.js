const Discord = require('discord.js')
const config = require('./config.json')
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
    feed = 'https://dev.to/feed',
    interval = 10

const watcher = new Watcher(feed, interval)

const client = new Discord.Client({
    autoReconnect: true
})

// ---------------------- Ready ----------------------
client.on('ready', async ()  =>  {    
    watcher.start()
        .then(function(entries) {})
        .catch(function(error) { console.log(error)})
    watcher.on('new entries', function(entries) {
        entries.forEach(function(entry) {           
            WebhookRedditRSSc.send(`[${entry.title}](${entry.link}) — Published by ${entry.author}`)
            console.log('New entry \nTitle : ' + entry.title + 
            "\nURL : " + (entry.url || entry.link) + "\n\n")
        })
    })
    console.log(`Connected to ${client.user.username} (ID : ${client.user.id})\n`)
    client.user.setActivity('news', { type: 'WATCHING' }).catch(console.error)

})

// ---------------------- Messages ----------------------
client.on('message', (msg) => { 

    if (msg.author.client) return
    if(msg.channel.recipient) return

})

client.login(config.token)
    .catch(e => console.error(e.message))
