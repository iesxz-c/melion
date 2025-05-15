import "dotenv/config";
import { scrapeWebsite } from "./scrapper";

async function main() {
  const url = "https://sathyabama.ac.in/about-us";
  const content = await scrapeWebsite(url);

  console.log("Scraped content:\n");
  console.log(content.slice(0, 1000)); // Print first 1000 chars
}

main();
