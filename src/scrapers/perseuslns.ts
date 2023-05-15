import { ItemView, WorkspaceLeaf, Menu, ButtonComponent, TextComponent, DropdownComponent, request } from "obsidian";
import { Scraper } from "./scraper";

export class PerseusLnsScraper extends Scraper {


	async getEntry(query:string): Promise<string | null> {
		try {

			var text = await super.getEntry('https://www.perseus.tufts.edu/hopper/text\?doc\=Perseus%3Atext%3A1999.04.0059%3Aentry%3D'+query);
			var entry = super.parseElement(text, ".text_container", query);
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
