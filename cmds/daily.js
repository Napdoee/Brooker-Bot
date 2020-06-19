const Discord = require("discord.js");
const db = require("quick.db");
const ms = require("parse-ms");

module.exports.run = async (bot, message, args) => {
  if (!message.content.startsWith("a.")) return;

  let user = message.author;

  let timeout = 86400000;
  let amount = 200;

  let daily = await db.fetch(`daily_${message.guild.id}_${user.id}`);

  if (daily !== null && timeout - (Date.now() - daily) > 0) {
    let time = ms(timeout - (Date.now() - daily));

    let timeEmbed = new Discord.RichEmbed()
      .setColor("#FFFFFF")
      .setDescription(
        `🚫 | Anda sudah mengumpulkan hadiah harian Anda\n\nDapatkan lagi dalam ${time.hours}h ${time.minutes}m ${time.seconds}s `
      );
    message.channel.send(timeEmbed);
  } else {
    let moneyEmbed = new Discord.RichEmbed()
      .setColor("#FFFFFF")
      .setDescription(
        `✅ | Anda telah mengumpulkan hadiah harian Anda sebesar ${amount} koin`
      );
    message.channel.send(moneyEmbed);
    db.add(`money_${message.guild.id}_${user.id}`, amount);
    db.set(`daily_${message.guild.id}_${user.id}`, Date.now());
  }
};

module.exports.help = {
    name: "daily",
    description: "daily prize",
    category: "Economy",
    usage: "`a.daily`"
}