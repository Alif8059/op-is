const { Command, SwitchbladeEmbed, CommandError } = require('../../../')
 
const buttons = ['Q', 'W', 'E', 'R']
 
module.exports = class LeagueOfLegendsChampion extends Command {
  constructor (client) {
    super({
      name: 'champion',
      aliases: ['champ', 'c'],
      parent: 'leagueoflegends',
      parameters: [{
        type: 'string', full: true, missingError: 'commands:leagueoflegends.subcommands.champion.noChampion'
      }]
    }, client)
  }
 
  async run ({ t, author, channel, prefix, language }, champion) {
    channel.startTyping()
    const embed = new SwitchbladeEmbed(author)
    try {
      const { fetchChampion, getLocale, version } = this.client.apis.lol
      const { name, title, blurb, image, spells, skins, stats } = await fetchChampion(champion, language)
      const { hp, hpregen, mp, mpregen, armor, attackdamage, crit, hpperlevel, hpregenperlevel, mpperlevel, mpregenperlevel, attackdamageperlevel, critperlevel } = stats
      const { Health, HealthRegen, Mana, ManaRegen, Armor, Attack, CriticalStrike, Level } = await getLocale(language)
      const { embedColor, authorString, authorImage, authorURL } = this.parentCommand
      embed.setColor(embedColor)
        .setAuthor(t(authorString), authorImage, authorURL)
        .setTitle(`**${name}**, ${title}`)
        .setThumbnail(`https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${image.full}`)
        .setDescription([
          blurb,
          '',
          `**${Health}:** ${hp} - ${hpperlevel}/${Level}`,
          `**${HealthRegen}:** ${hpregen} - ${hpregenperlevel}/${Level}`,
          `**${Mana}:** ${mp} - ${mpperlevel}/${Level}`,
          `**${ManaRegen}:** ${mpregen} - ${mpregenperlevel}/${Level}`,
          `**${Armor}:** ${armor} - ${armorperlevel}/${Level}`,
          `**${Attack}:** ${attackdamage} - ${attackdamageperlevel}/${Level}`,
          `**${CriticalStrike}:** ${crit} - ${critperlevel}/${Level}`
        ].join('\n'))
        .addField(t('commands:leagueoflegends.subcommands.champion.spells'), spells.map((spell, i) => `**${spell.name}** (${buttons[i]})`).join(', '), true)
        .addField(t('commands:leagueoflegends.subcommands.champion.skins'), `${skins.filter(s => s.name !== 'default').map(skin => `**${skin.name}**`).join(', ')}\n\n*${t('commands:leagueoflegends.subcommands.champion.skinText', { skinCommandUsage: `${prefix}leagueoflegends skin ${t('commands:leagueoflegends.subcommands.skin.commandUsage')}` })}*`)
      channel.send(embed).then(() => channel.stopTyping())
    } catch (e) {
      throw new CommandError(t('commands:leagueoflegends.subcommands.champion.invalidChamp'))
    }
  }
}