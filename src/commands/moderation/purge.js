const { Command, SwitchbladeEmbed } = require('../../')

module.exports = class Purge extends Command {
  constructor (client) {
    super({
      name: 'purge',
      aliases: ['prune'],
      category: 'moderation',
      requirements: { guildOnly: true, botPermissions: ['MANAGE_MESSAGES'], permissions: ['MANAGE_MESSAGES'] },
      parameters: [{
        type: 'number',
        required: false,
        min: 1,
        max: 100,
        missingError: 'commands:purge.invalidNumber'
      }, {
        type: 'member', required: false, full: false, acceptSelf: true, acceptBot: true
      }]
    }, client)
  }

  async run ({ channel, guild, author, t }, number = 50, member) {
    const embed = new SwitchbladeEmbed(author)
    if (member) {
      channel.messages.fetch({ limit: number })
        .then(messages => {
          const userMessages = messages.filter(m => m.author.id === member.id)
          channel.bulkDelete(userMessages).then(() => {
            embed.setDescription(t(userMessages.size > 1 ? 'commands:purge.purgedMemberPlural' : 'commands:purge.purgedMemberSingular', { count: number, user: member.displayName }))
            channel.send({ embeds: [embed] })
          }).catch(() => {
            return channel.send({
              embed: [new SwitchbladeEmbed()
                .setTitle(t('errors:generic'))
              ]
            })
          })
        }).catch(() => {
          return channel.send({
            embed: [new SwitchbladeEmbed()
              .setTitle(t('errors:generic'))]
          })
        })
    } else {
      channel.bulkDelete(number).then(() => {
        embed.setDescription(t(number > 1 ? 'commands:purge.purgedPlural' : 'commands:purge.purgedSingular', { count: number }))
        channel.send({ embeds: [embed] })
      }).catch(() => {
        return channel.send({
          embeds: [new SwitchbladeEmbed()
            .setTitle(t('errors:generic'))]
        })
      })
    }
  }
}
