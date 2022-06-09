import { Client, MessageEmbed } from "discord.js";
import { schedule } from "node-cron";
import hdate from "human-date";
import { getTextChannels } from "../discord";

const MARIO_STRICKER_RELEASE_DATE = new Date("2022-06-10");
const MARIO_STRICKER_URLS_IMAGE = [
  "https://fs-prod-cdn.nintendo-europe.com/media/images/10_share_images/games_15/wii_24/SI_Wii_MarioStrikersChargedFootball_image1600w.jpg",
  "https://fs-prod-cdn.nintendo-europe.com/media/images/10_share_images/games_15/nintendo_switch_4/2x1_NSwitch_MarioStrikersBattleLeagueFootball_image1600w.jpg",
  "https://cdn.sortiraparis.com/images/80/66131/724632-mario-strikers-battle-league-football-bande-annonce-et-date-de-sortie.jpg",
  "https://m.media-amazon.com/images/I/814e0XJboML._AC_SL1500_.jpg",
  "https://www.lacremedugaming.fr/wp-content/uploads/creme-gaming/2022/05/mario-strikers-switch-5.jpg",
];

export function scheduleMarioStrickerCooldown(client: Client) {
  schedule("0 20 * * *", async () => {
    if (new Date() > MARIO_STRICKER_RELEASE_DATE) return;

    const relativeTime = getTimeBeforeMarioStrickerRelease();
    const channel = getTextChannels(client).shift();
    if (channel == null) return;

    const urlImage = getRandomUrlImage();
    const embed = new MessageEmbed()
      .setColor("#E6742B")
      .setImage(urlImage)
      .setTitle("🎮 Mario Strikers: Battle League Football")
      .setDescription(`⏳ Release in ${relativeTime}`);

    if (isReleaseDay())
      embed
        .setDescription("🎉 Available now!")
        .setImage(MARIO_STRICKER_URLS_IMAGE[1]);

    await channel.send({ embeds: [embed] });
  });
}

function isReleaseDay(): Boolean {
  return (
    new Date().toLocaleDateString() ==
    MARIO_STRICKER_RELEASE_DATE.toLocaleDateString()
  );
}

function getRandomUrlImage(): string {
  return MARIO_STRICKER_URLS_IMAGE[
    Math.floor(Math.random() * MARIO_STRICKER_URLS_IMAGE.length)
  ];
}

export function getTimeBeforeMarioStrickerRelease(): string {
  return hdate.relativeTime(MARIO_STRICKER_RELEASE_DATE);
}
