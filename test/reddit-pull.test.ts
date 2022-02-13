import { Client } from "discord.js";
import { Reddit } from "src/reddit/reddit";

const reddit = new Reddit(new Client({ intents: [] }));
const redditProto = Object.getPrototypeOf(reddit);

test("is url a gif", () => {
    const urlImage =
        "https://3.bp.blogspot.com/-hgi_TL8AFic/UwOQ5ja0TRI/AAAAAAAAQXw/oxSs5fE96wM/s1600/giphy.gif";
    expect(redditProto.isUrlImage(urlImage)).toBe(true);
});

test("is url a jpg", () => {
    const urlImage =
        "https://codem.tk/portfolio/wp-content/uploads/2021/06/58420247_1969789233149432_758322363539390464_o.jpg";
    expect(redditProto.isUrlImage(urlImage)).toBe(true);
});

test("is url a jpg", () => {
    const urlImage = "https://pierrejulien.fr/images/photo_profil.png";
    expect(redditProto.isUrlImage(urlImage)).toBe(true);
});
