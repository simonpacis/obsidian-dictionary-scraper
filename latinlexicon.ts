import { ItemView, WorkspaceLeaf, Menu, ButtonComponent, TextComponent, DropdownComponent, request } from "obsidian";
import { Scraper } from "./scraper";

export class LatinLexiconScraper extends Scraper {


	async getWordList(query:string): Promise<string | null> {

		try {

			var res = await super.postEntry("https://latinlexicon.org/ajax/lookup_json.php", {p1: query});
			res = JSON.parse(res).optgroup;

			var entry = document.createElement('div');
			for(var i = 0; i < res.length; i++)
			{
				entry.innerHTML += "<br><strong>" + res[i].label + "</strong><br>";
				for(var ii = 0; ii < res[i].options.length; ii++)
				{
					var option = res[i].options[ii];
					if(ii != 0)
						{
							entry.innerHTML += "<br>";
						}
						entry.innerHTML += "<a href='obsidian://obsidian-perseus?key=latinlexicon&id="+option.id+"'>" + option.form + "</a>";
				}
				entry.innerHTML += "<br>&nbsp;<br>";

			}
			return entry;
		}
		catch (e) {
			console.log(e);
		}

	}

	async getEntry(id:string): void 
	{
		var res = await super.getEntry('https://latinlexicon.org/definition.php?p1='+id);

		var parser = new DOMParser();
		var doc = parser.parseFromString(res, "text/html");
		var entry = document.createElement('div');
		entry.innerHTML = "<strong>"+doc.querySelector('.flash_card_title').innerText + "</strong><br>";
		var etymology_elem = doc.querySelector('.flash_card_etymology a');
		if(etymology_elem != null)
			{
				var etymology_link = '<a style="font-variant: small-caps;" href="obsidian://obsidian-perseus?key=latinlexicon&id='+etymology_elem.getAttribute('orthography_id')+'">'+etymology_elem.innerText+'</a>';
				entry.innerHTML += etymology_link + "<br>";
			}

		var info_elem = doc.querySelector('.flash_card_info');
		if(info_elem != null)
			{
				entry.innerHTML += info_elem.innerText + "<br>";
			}
		var definition_elem = doc.querySelector('.flash_card_english_def');
		if(definition_elem != null)
			{
				entry.innerHTML += "<em>Definition</em><br>" + definition_elem.innerHTML + "<br>";
			}
			entry.innerHTML += "<hr>";
			var reference_node = document.querySelector(".end-hr");
			var parent_div = document.querySelector(".dictionary-scraper-parent-div");
			parent_div.insertAfter(entry, reference_node);
		
	}

	async protocolHandler(id:integer): void
	{
		this.getEntry(id);
	}

	async getAndPrintEntry(query:string): void
	{
		var entry = await this.getWordList(query);
		super.printEntry(entry, true, false);
	}


}
