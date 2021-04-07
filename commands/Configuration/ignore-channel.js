const db = require("quick.db")
const {MessageEmbed} = require('discord.js')

module.exports = {
  name: "ignore-channel",
  usage: `\`ignorech [ on || off || <#channel> ]\``,
  detail: `**Information**
\`\`\`
- Toggle ignorech
{prefix}ignorech <on || off>
  
- Set Channel
{prefix}ignorech <#channel>

- Delete Channel
{prefix}ignorech <#channel>
Note: Mention a channel that is in the database
\`\`\``,
  description:`Ignore users to use bot command in the channel.`,
  authorPermission: ["MANAGE_GUILD"],
  category: "Configuration",
  aliases: ['igch', 'ignorech'],
  run: async(client, message, args) => { 
    
  let channel = message.mentions.channels.first();
    
  let ignores = await db.fetch(`ignorech_${message.guild.id}.channel`)
  if(ignores === null || ignores === undefined) ignores = "None"
  
  let ignore = db.fetch(`ignorech_${message.guild.id}.toggle`)
  if (ignore === null || ignore === undefined) ignore = "off"
    
    if (!args[0]) {  
    
    let ch4 = [];
    if (ignores === 'None') {
       ch4 = "[ None ]"
    } else {
       ch4 = ignores.map(e => `\n- ${client.channels.cache.get(e) ? client.channels.cache.get(e).name : "Unknown"}`).join(' ') || "None"
    }

      const emb = new MessageEmbed()
      .setAuthor('Ignore Channel', client.user.displayAvatarURL())
      .setColor(client.config.color)
      .setDescription(`
\`\`\`
Ignorech is [${ignore.toUpperCase()}]
Ignorech list: ${ch4 || "Not set."}
\`\`\``)
.setFooter(`Read more ${client.config.prefix}help ${module.exports.name}`)

  message.channel.send(emb)
    
  } else if (args[0] === "on") {
    db.set(`ignorech_${message.guild.id}.toggle`, "on")
    let embed = new MessageEmbed()
    .setColor(client.config.color)
    .setAuthor('Ignore Channel', client.user.displayAvatarURL())
    .setDescription(`ignorech has been set [ON]`)
    
    message.channel.send(embed)
  } else if (args[0] === "off") {
    db.set(`ignorech_${message.guild.id}.toggle`, "off")
    let embed = new MessageEmbed()
    .setColor(client.config.color)
    .setAuthor('Ignore Channel', client.user.displayAvatarURL())
    .setDescription(`ignorech has been set [OFF]`)
    
    message.channel.send(embed)
  } else {
      if(ignore !== 'on') {
        let wrong = new MessageEmbed().setColor(client.config.color) 
        .setAuthor('Ignores Settings', client.user.displayAvatarURL())
        .setDescription(`Ignorech must be [ON] first `)
  
        message.channel.send(wrong)        
      } 
      else if(!channel) {
        let wrong = new MessageEmbed().setColor(client.config.color) 
        .setAuthor('Ignore Channel', client.user.displayAvatarURL())
        .setDescription(`Invalid Argument!`)
  
        message.channel.send(wrong)
      } else if(ignores.includes(channel.id)) {
         let database = db.get(`ignorech_${message.guild.id}.channel`)
         let data = database.find(x => x === channel.id)
         let value = database.indexOf(data)
         delete database[value]

         var filter = database.filter(x => {
         return x != null && x != ''
         })
         db.set(`ignorech_${message.guild.id}.channel`, filter) 
        
        let already = new MessageEmbed().setColor(client.config.color)
        .setAuthor('Ignore Channel', client.user.displayAvatarURL())
        .setDescription(`ignorech channel has been delete **${channel.name}**`)   
    
        message.channel.send(already)
      } else {
          db.push(`ignorech_${message.guild.id}.channel`, channel.id) 
          
          let embed = new MessageEmbed().setColor(client.config.color) 
          .setAuthor('Ignore Channel', client.user.displayAvatarURL()) 
          .setDescription(`**${channel.name}** channel has been add to Ignorech`)
          
          message.channel.send(embed)
      }
  }
}}