import { ItemView, WorkspaceLeaf, Menu, ButtonComponent, TextComponent, DropdownComponent, request } from "obsidian";

export class Scraper {

	noResultsFound(query:string): HTMLElement {
		var entry = document.createElement('p');
		entry.innerHTML = 'No results found for "'+query+'".';
		return entry;
	}

	addSuffix(entry:HTMLElement): HTMLElement {
		entry.innerHTML = entry.innerHTML + "<hr>";
		return entry;
	}

	removeLinks(entry:HTMLElement): HTMLElement {
		entry.innerHTML = entry.innerHTML.replace(/<\/?a[^>]*>/g, ""); // Remove links
		return entry;
	}

	addSuffixAndRemoveLinks(entry:HTMLElement): HTMLElement {
		entry = this.removeLinks(entry);
		entry = this.addSuffix(entry);
		return entry;
	}

	async getEntry(url:string): string {
		var res = await request(url);
		return res;
	}

	async postEntry(url:string, data:object): object {
		var res = await request(
			{
				url: url,
				method: "POST",
				contentType: "application/x-www-form-urlencoded",
				body: new URLSearchParams(data).toString()
			}
		);
		return res;
	}

	parseElement(html:string, selector:string, query:string = "null"): HTMLElement | null {
		var parser = new DOMParser();
		var doc = parser.parseFromString(html, "text/html");
		var entry = doc.querySelector(selector);
		if(query != "null" && entry == null)
			{
				return this.noResultsFound(query);
			}
		return entry;
	}


	printEntry(entry:HTMLElement, add_suffix:boolean = true, remove_links:boolean = true): void
	{
		if(add_suffix)
			{
				entry = this.addSuffix(entry);
			}
		if(remove_links)
			{
				entry = this.removeLinks(entry);
			}
		var reference_node = document.querySelector(".end-hr");
		var parent_div = document.querySelector(".dictionary-scraper-parent-div");
		parent_div.insertAfter(entry, reference_node);
	}




}
