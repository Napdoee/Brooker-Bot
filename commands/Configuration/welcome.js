const Discord = require("discord.js");
const db = require("quick.db");
const { CanvasSenpai } = require("canvas-senpai")
const canva = new CanvasSenpai();

module.exports = {
  name: "welcome",
  description: `Send a welcome message when there new members`,
  category: "Configuration",
  usage: `\`welcome [on || off | msg || <#channel> || <@roles / @roles delete>]\``,
  detail: `**Information**
\`\`\`
- Toggle Welcome
{prefix}welcome <on || off>

- Set Channel
{prefix}welcome <#channel>

- Set Roles
{prefix}welcome <@roles>
{prefix}welcome <@roles> delete

- Set Message
{prefix}welcome msg <message>

- Show Preview
{prefix}welcome preview

- Message Settings
=> {users} = @user
=> {usertag} = user#1234
=> {username} = user

=> {server} = server name
=> {count} = server member count

Ex: Welcome {usertag} to {server} you are {count} member.
\`\`\``,
  authorPermission: ["MANAGE_GUILD"],
  aliases: ["setwelcome"],
  run: async (client, message, args) => { 
    
    let channel = message.mentions.channels.first(); 
    
    let welmsg = db.get(`welcome_${message.guild.id}.msg`)
    if (welmsg === null || welmsg === undefined) welmsg = `📥 {usertag} **Has joined the server**`
    
    let replaces = welmsg.replace("{users}", message.author) 
                   .replace("{username}", message.author.username) 
                   .replace("{usertag}", message.author.tag) 
                   .replace("{server}", message.guild.name) 
                   .replace("{count}", message.guild.memberCount) 

    let welcome = await db.fetch(`welcome_${message.guild.id}.toggle`)
    if (welcome === null) welcome = "off"
    
    let roles = message.mentions.roles.first() || message.guild.roles.cache.get(args[1]);
    
    if(!args[0] && !channel) {  
    
    let welmsg = await db.fetch(`welcome_${message.guild.id}.msg`)
    if (welmsg === null || welmsg === undefined) welmsg = "[ Default by bot ]"
    
    let welch = await db.fetch(`welcome_${message.guild.id}.channel`)
    let ch = client.channels.cache.get(welch)
    if (ch === null) ch = "Not set"
    if (ch === undefined) ch = "Invalid ID"
      
    let rls = await db.fetch(`welcome_${message.guild.id}.roles`)
    let roles = message.guild.roles.cache.get(rls)
    if(roles == null) roles = "Not set"
    if(roles  === undefined) roles = "Invalid ID"
      
    let embed = new Discord.MessageEmbed()
    .setColor(client.config.color)
    .setAuthor('Welcome Settings', client.user.displayAvatarURL())
    .addField(`Welcome toggle is`, `[${welcome ? 'ON' : 'OFF'}]`)
    .addField(`Welcome set in`, `${ch || "[ Not set. ]"}`)
    .addField('Welcome Roles', `${roles}`)
    .addField(`Welcome Message:`, `${welmsg || "[ Default by bot ]"}`)
    .setFooter(`Read more ${client.config.prefix}help ${module.exports.name}`)
    message.channel.send(embed) 
  
    //Message
    } else if (args[0] === "message" || args[0] === "msg") {
       let messag = args.slice(1).join(" ")
       if (!messag) {
        db.set(`welcome_${message.guild.id}.msg`, null)
       let embed = new Discord.MessageEmbed().setColor(client.config.color) 
        .setAuthor('Welcome Message', client.user.displayAvatarURL())
        .setDescription(`Welcome message has been set default`)
  
       message.channel.send(embed)
         
       } else { 
         
       db.set(`welcome_${message.guild.id}.msg`, messag)
       let embed = new Discord.MessageEmbed().setColor(client.config.color) 
      .setAuthor('Welcome Message', client.user.displayAvatarURL())
      .setDescription(`Welcome message has been set \n\`\`\`${messag}\`\`\``)
  
       message.channel.send(embed)
      }

    } else if(args[0] === "preview") {
      
       let wrong = new Discord.MessageEmbed().setColor(client.config.color) 
        .setAuthor('Welcome Settings', client.user.displayAvatarURL())
        .setDescription(`Welcome must be [ON] first `)
      if(!welcome) return  message.channel.send(wrong)   
      
      message.channel.send('Loading...').then(m => m.delete({timeout: 5000}))
      
     let data = await canva.welcome(message.member, { 
      link: "https://media.discordapp.net/attachments/794505995879579648/798933215100272750/20210113_231513.jpg?width=1025&height=370", 
      blur: false,
      block: false 
     })
     const attachment = new Discord.MessageAttachment(data, "welcome-image.png");
    
      var preview = new Discord.MessageEmbed().setColor(client.config.color) 
      .setDescription(replaces)
      .attachFiles([attachment]).setImage('attachment://welcome-image.png')
      message.channel.send(preview)
      
    //Toggle On
    } else if (args[0] === "on") {
      db.set(`welcome_${message.guild.id}.toggle`, true) 
      let embed = new Discord.MessageEmbed().setColor(client.config.color) 
      .setAuthor('Welcome Toggle', client.user.displayAvatarURL())
      .setDescription(`Welcome channel has been [ON]`)
      
      message.channel.send(embed)
      
    //Toggle Off
    } else if (args[0] === "off") {
       db.set(`welcome_${message.guild.id}.toggle`, false) 
      let embed = new Discord.MessageEmbed().setColor(client.config.color) 
      .setAuthor('Welcome Toggle', client.user.displayAvatarURL())
      .setDescription(`Welcome channel has been [OFF]`)
      
      message.channel.send(embed)
      
    //Channel
    } else {
      
      if(!welcome) {
        let wrong = new Discord.MessageEmbed().setColor(client.config.color) 
        .setAuthor('Welcome Settings', client.user.displayAvatarURL())
        .setDescription(`Welcome must be [ON] first `)
  
        message.channel.send(wrong)        
      } else if(!channel && roles) {
        
        if (!roles.editable) return client.sendInvalid("i can't access that roles");
        let rls = db.get(`welcome_${message.guild.id}.roles`)
        
        if(args[0] === `<@&${rls}>` && args[1] === 'delete') {
           db.delete(`welcome_${message.guild.id}.roles`)
          
          let wrong = new Discord.MessageEmbed().setColor(client.config.color) 
          .setAuthor('Welcome Settings', client.user.displayAvatarURL())
          .setDescription(`Succesfully delete roles **${roles.name}**`)
          
          return message.channel.send(wrong)
          
        } 
        
        db.set(`welcome_${message.guild.id}.roles`, roles.id)
        
        let wrong = new Discord.MessageEmbed().setColor(client.config.color) 
        .setAuthor('Welcome Settings', client.user.displayAvatarURL())
        .setDescription(`Succesfully added roles **${roles.name}**`)
  
        return message.channel.send(wrong)
      } else if(channel.permissionsFor(client.user).has("SEND_MESSAGES", "VIEW_CHANNEL")) {
          db.set(`welcome_${message.guild.id}.channel`, channel.id) 
          
          let embed = new Discord.MessageEmbed().setColor(client.config.color) 
          .setAuthor('Welcome Channel', client.user.displayAvatarURL()) 
          .setDescription(`Welcome channel has been set in **${channel.name}**`)
          
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
}};