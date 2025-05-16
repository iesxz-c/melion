import axios from "axios";
import * as cheerio from "cheerio";

export async function scrapeWebsite(url: string): Promise<string> {
  const res = await axios.get(url);
  const $ = cheerio.load(res.data);

  const elements = ["h1", "h2", "h3", "h4", "h5", "h6", "p", "li", "a"];
  const text = elements
    .map(tag => 
      $(tag).map((_, el) => $(el).text().trim()).get().join("\n")
    )
    .join("\n\n");

  return text.trim();
}
