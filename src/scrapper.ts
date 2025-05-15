import axios from "axios";
import * as cheerio from "cheerio"; // ✅ FIXED LINE

export async function scrapeWebsite(url: string): Promise<string> {
  const res = await axios.get(url);
  const $ = cheerio.load(res.data);

  const text = $("p")
    .map((_, el) => $(el).text())
    .get()
    .join("\n");

  return text;
}
