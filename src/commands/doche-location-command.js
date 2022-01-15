import { MessageEmbed } from "discord.js";
import fetch from "node-fetch";

export class WhereIsDocheCommand {
  constructor(client, interaction) {
    this.client = client;
    this.interaction = interaction;
  }

  async run() {
    this.client.api
      .interactions(this.interaction.id, this.interaction.token)
      .callback.post({
        data: {
          type: 4,
          data: {
            embeds: [await this.getEmbedMessage()],
          },
        },
      });
  }

  async getEmbedMessage() {
    const docheLocation = await this.getDocheLocation();
    return new MessageEmbed()
      .setColor("#E6742B")
      .setTitle(`🛰️ Doche location: ${docheLocation}`);
  }

  async getDocheLocation() {
    const response = await fetch(
      "https://codem.tk/geo/api/discord-user/192718089979166720"
    );
    const doche = await response.json();
    return await doche.geolocalisation;
  }
}
