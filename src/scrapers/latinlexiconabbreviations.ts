import { ItemView, WorkspaceLeaf, Menu, ButtonComponent, TextComponent, DropdownComponent, request } from "obsidian";
import { Scraper } from "./scraper";

export class LatinLexiconAbbreviationsScraper extends Scraper {

	async getAbbreviations(): Promise<string | null> {
		try {

			var text = await super.getEntry('https://latinlexicon.org/LEM_abbreviations.php');
			var entry = super.parseElement(text, "#main_container");
			entry = super.removeLinks(entry);

			entry.innerHTML = "Fetched from: <a href='https://latinlexicon.org/LEM_abbreviations.php'>https://latinlexicon.org/LEM_abbreviations.php</a><br>&nbsp;<br>" + entry.innerHTML; 
			return entry;
		}
		catch (e) {
			console.log(e);
			return null;
		}
	}


	async onClick(): void
	{
		var entry = await this.getAbbreviations();
		super.printEntry(entry, true, false);
	}


}
