const db = require("quick.db")
//const { MessageButton, MessageActionRow, MessageMenu, MessageMenuOption } = require('discord-buttons')
const Discord = require('discord.js')

module.exports = {
  name: "level-settings",
  usage: `\`leveling [ on || off || <#channel> ]\``,
  detail: `**Information**
\`\`\`
- Set Channel
{prefix}leveling <#channel>

- Toggle Leveling
{prefix}leveling <on || off>

- Delete Channel
{prefix}leveling <#channel>
Note: Mention a channel that is in the database
\`\`\``,
  description: `Settings for the leveling system`,
  authorPermission: ["MANAGE_GUILD"],
  category: "Configuration",
  aliases: ["leveling", "xp-settings"],
  run: async(client, message, args) => { 
    
  let channel = message.mentions.channels.first(); 
  
  let lvlch = await db.fetch(`level_${message.guild.id}.channel`)
  let toggle = await db.fetch(`level_${message.guild.id}.toggle`)
    
   if (!args[0]) {  
    
    let lvlch = await db.fetch(`level_${message.guild.id}.channel`)
    let ch3 = client.channels.cache.get(lvlch)
    if (ch3 === null ) ch3 = "[ Not set ]"
    if (ch3 === undefined) ch3 = "[ Auto: message channel ]"
     
    const emb = new Discord.MessageEmbed()
    .setAuthor('Level Settings', client.user.displayAvatarURL()).setColor(client.config.color)
    .addField(`Leveling toggle is`,`[${toggle ? 'ON' : 'OFF'}]`)
    .addField(`Leveling log set in`,`${ch3 || "[ Auto: message channel ]"}`)
    .setFooter(`Read more ${client.config.prefix}help ${module.exports.name}`)
    
    message.channel.send(emb)
  } else if (args[0] === "on") {
    db.set(`level_${message.guild.id}.toggle`, true)
    let embed = new Discord.MessageEmbed()
    .setColor(client.config.color)
    .setAuthor('Level Toggle', client.user.displayAvatarURL())
    .setDescription(`level has been set [ON]`)
    
    message.channel.send(embed)
    
    
  } else if (args[0] === "off") {
    db.set(`level_${message.guild.id}.toggle`, null)
    let embed = new Discord.MessageEmbed()
    .setColor(client.config.color)
    .setAuthor('Level Toggle', client.user.displayAvatarURL())
    .setDescription(`level has been set [OFF]`)
    
    message.channel.send(embed)
    
    
  } else {
      if(toggle !== true) {
        let wrong = new Discord.MessageEmbed().setColor(client.config.color) 
        .setAuthor('Level Settings', client.user.displayAvatarURL())
        .setDescription(`Leveling must be [ON] first `)
  
        message.channel.send(wrong)        
      } else if(!channel) {
        let wrong = new Discord.MessageEmbed().setColor(client.config.color) 
        .setAuthor('Level Settings', client.user.displayAvatarURL())
        .setDescription(`Invalid Argument!`)
  
        message.channel.send(wrong)
      } else if(lvlch === channel.id) {
         db.delete(`level_${message.guild.id}.channel`) 
        
        let already = new Discord.MessageEmbed().setColor(client.config.color)
        .setAuthor('Level Channel', client.user.displayAvatarURL())
        .setDescription(`Level channel has changed to message channel`)   
    
        message.channel.send(already)
      } else if(channel.permissionsFor(client.user).has("SEND_MESSAGES", "VIEW_CHANNEL")) {
          db.set(`level_${message.guild.id}.channel`, channel.id) 
          
          let embed = new Discord.MessageEmbed().setColor(client.config.color) 
          .setAuthor('Level Channel', client.user.displayAvatarURL()) 
          .setDescription(`level channel has been set in **${channel.name}**`)
          
          message.channel.send(embed)
      } else {
          var missingPermissionsEmbed = new Discord.MessageEmbed()
          .setColor(client.config.color)
          .setAuthor(message.author.username, message.author.displayAvatarURL())
          .setTitle("Insufficient Permissions!")
          .setDescription(`I need the \`SEND_MESSAGES, VIEW_CHANNEL\` permission in ${channel} channel!`)
          
          message.channel.send(missingPermissionsEmbed)
      }
  }
}}