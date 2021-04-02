const moment = require("moment");
const db = require('quick.db')
const discord = require('discord.js')

module.exports = {
  name: "partner",
  description: "parnter",
  category: "Developer",
  ownerOnly: true,
  usage: "partner",
  aliases: [""],
  run: async (client, message, args) => {  
    
  let partner = db.get(`partner`)
  
  let guild = client.guilds.cache.get(args[0])
  if(!guild) return message.channel.send('Im not join dhat server')
  
  let already = partner.find(x => x.id === guild.id)
  if(already) return message.channel.send('This guild has been add to partner')
    
  let invitechannels = guild.channels.cache.filter(c=> c.permissionsFor(guild.me).has('CREATE_INSTANT_INVITE'))
  if(!invitechannels) return message.channel.send('No Channels found with permissions to create Invite in!')
    
  invitechannels.random().createInvite().then(invite => {
    let data = {
      id: guild.id,
      link: 'https://discord.gg/'+invite.code
    }
     db.push(`partner`, data)
    message.channel.send('Succesfully adding this server to Partner')
   })    
  }
}