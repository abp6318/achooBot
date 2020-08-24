/**
*   npm init
*   npm install node
*   npm install axios
*/

/**
 * Take in:
 * -player name
 * -region
 *  https://lolchess.gg/search?region=<region goes here>&name=<name goes here>
 * 
 * Give back: in fancy embed too!
 * -player name
 * -region
 * -rank
 * -lp
 * -top%
 * -top#
 * -last updated time & date
 * 
 *
 */


const axios = require('axios')
const Discord = require('discord.js')
const config = require('./config')
const discordClient = new Discord.Client()

discordClient.on('ready', () => {
  console.log(`Logged in as ${discordClient.user.tag}!`)
})
discordClient.login(config.discordApiToken)



var PREFIX = "."
var region = ""
var accountName = ""
var link = ""
var rank = ""
var lp = ""
var topPercent = ""
var topRank = ""
var rankColor = "#ffffff"

// 	.setDescription('Please DM any and all issues to me! Also, reach out to play TFT w/ me. Peak Diamond 1 in set 3.5, or norms if you want :D')


const helpEmbed = new Discord.MessageEmbed()
	.setColor('#333666')
	.setTitle('Commands & More')
	.addField('.help', 'Brings up this lovely message!', false)
        .addField('.tft <region abbreviation> <player name>', 'If that player exists, it should return the players current rank, amount of LP, top percentage in the region, and top rank in the region.', false)
        .addField('Bug/Error Report', 'If you encounter any bugs or errors, feel free to DM me, (aa)ron #3781, on Discord.')
        .addField('Updates', 'I will be making occasionaly updates to this, adding error checking, and making things prettier. I will post here when I have the bot hosted and up 24/7.');

discordClient.on('message', async msg => {
        let args = msg.content.substring(PREFIX.length).split(" ");
        accountName = ""

        if(msg.content.substring(0,1) == PREFIX){
                switch(args[0]){
                        case "help":
                                msg.channel.send(helpEmbed)
                                break;
                        case "tft":
                                region = args[1]
                                for( i=2; i<args.length; i++){
                                        accountName += args[i]
                                }
                                link = "https://lolchess.gg/profile/" + region + "/" + accountName 

                                axios
                                        .get(link)
                                        .then((response) => {

                                        var rankValues = response.data.substring(response.data.search('class="profile__tier__summary__tier'), response.data.search('class="profile__tier__bar-graph'))
                                        rank = rankValues.split(">")[1].split("<")[0]
                                        console.log(rank)
                                        lp = rankValues.split(">")[3].split("<")[0]
                                        console.log(lp)

                                        // start : class="top-percent
                                        // end : class="profile__tier__stats
                                        var topValues = response.data.substring(response.data.search('class="top-percent'), response.data.search('class="profile__tier__stats'))
                                        // console.log(initialTwo)
                                        topRank = topValues.split(">")[3].split("<")[0].trim()
                                        console.log(topRank)
                                        topPercent = topValues.split(">")[1].split("<")[0].trim()
                                        console.log(topPercent)




                                        var exampleEmbed = new Discord.MessageEmbed()
                                                .setColor(rankColor)
                                                .setTitle(accountName)
                                                .setURL(link)
                                                .setDescription('LoL Chess Profile')
                                                .addFields(
                                                        { name: rank, value: topPercent, inline: true },
                                                        { name: lp, value: topRank, inline: true },
                                                )
                                                .setFooter('Click the user\'s name to see their profile');

                                        msg.channel.send(exampleEmbed);

                                        })
                                        .catch((error) => {
                                                msg.reply("Something about the command you tried to enter didn't quite work. Use the format \".tft <region abbreviation> <account name>\" to get your profile.")
                                                console.error(error)
                                        });
                                break;
                        default:
                                msg.reply("erm, Aaron didn't add any error checking because he is a lazy fuck. Use the format \".tft <region abbreviation> <account name>\" to get your profile.")
                                break;
                
                }
        }


})

