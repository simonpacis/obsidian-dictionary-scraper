import { ItemView, WorkspaceLeaf, Menu, ButtonComponent, TextComponent, DropdownComponent, request } from "obsidian";
import { Scraper } from "./scraper";

export class EnacademicScraper extends Scraper {


	async getWordList(query:string): Promise<string | null> {

		try {

			var html = await super.getEntry("https://morphological_el.en-academic.com/searchall.php?SWord="+query+"&from=en&to=xx&did=morphological_el&stype=");
			const parser = new DOMParser();
			const doc = parser.parseFromString(html, 'text/html');

			const items = doc.querySelectorAll('#found_articles > li');
			const res = [];

			items.forEach(item => {
				const label = item.querySelector('strong').textContent;
				const link = item.querySelector('a');
				const href = link.getAttribute('href'); // Directly using the href attribute
				const id = href.split('/').slice(-2).join('/');
				const option = {
					href: encodeURIComponent(id), // Adjust this based on how the ID is embedded in the href
					form: link.textContent
				};


				res.push({ label, options: [ option ] });
			});


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
						entry.innerHTML += "<a href='obsidian://obsidian-perseus?key=enacademic&data="+option.href+"'>" + option.form + "</a>";
				}
				entry.innerHTML += "<br>";

			}
			return entry;
		}
		catch (e) {
			console.log(e);
		}

	}

	async getEntry(id:string): void 
	{
		id = decodeURIComponent(id);
		console.log(id);
		var res = await super.getEntry('https://morphological_el.en-academic.com/'+id);

		var parser = new DOMParser();
		var doc = parser.parseFromString(res, "text/html");
		var entry = document.createElement('div');
		entry.innerHTML = doc.querySelector('#article').innerHTML;
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
