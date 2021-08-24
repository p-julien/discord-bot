export function getDiscordChannel(client, interaction) {
    for (const [key, value] of client.channels.cache)
        if (key === interaction.channel_id)
            return value

    throw new Error(`An error occured while searching for the channel name of the related interaction: ${interaction}`)
}