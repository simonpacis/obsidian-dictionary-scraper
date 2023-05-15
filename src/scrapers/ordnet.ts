import { ItemView, WorkspaceLeaf, Menu, ButtonComponent, TextComponent, DropdownComponent, request } from "obsidian";
import { Scraper } from "./scraper";

export class OrdnetScraper extends Scraper {


	async getEntry(query:string): Promise<string | null> {
		try {

			var text = await super.getEntry('https://ordnet.dk/ddo/ordbog?query='+query+'&tab=for');
			var entry = super.parseElement(text, ".artikel", query);
			return entry;
		}
		catch (e) {
			console.log(e);
			return null;
		}
	}

	async getAndPrintEntry(query:string): void
	{
		var entry = await this.getEntry(query);
		super.printEntry(entry);
	}


}
