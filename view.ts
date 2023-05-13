import { ItemView, WorkspaceLeaf, Menu, ButtonComponent, TextComponent, DropdownComponent, request } from "obsidian";

export const VIEW_TYPE = "perseus-view";

export class DictionaryView extends ItemView {

	async getAbbreviations(): Promise<string | null> {
		try {

			var res = await request('https://latinlexicon.org/LEM_abbreviations.php');
			console.log(res);

			var parser = new DOMParser();
			var doc = parser.parseFromString(res, "text/html");
			var entry = doc.querySelector('#main_container');
			entry.innerHTML = "Fetched from: <a href='https://latinlexicon.org/LEM_abbreviations.php'>https://latinlexicon.org/LEM_abbreviations.php</a><br>&nbsp;<br>" + entry.innerHTML.replace(/<\/?a[^>]*>/g, ""); // Remove links
			entry.innerHTML += "<hr>";
			return entry;
		}
		catch (e) {
			console.log(e);
			return null;
		}
	}

	async getLatinLexiconEntry(id:string): Promise<string | null> {
		var res = await request('https://latinlexicon.org/definition.php?p1='+id);
		var parser = new DOMParser();
		var doc = parser.parseFromString(res, "text/html");
		var entry = document.createElement('div');
		console.log(doc);
		entry.innerHTML = "<strong>"+doc.querySelector('.flash_card_title').innerText + "</strong><br>";
		var etymology_elem = doc.querySelector('.flash_card_etymology a');
		if(etymology_elem != null)
			{
				var etymology_link = '<a style="font-variant: small-caps;" href="obsidian://obsidian-perseus?id='+etymology_elem.getAttribute('orthography_id')+'">'+etymology_elem.innerText+'</a>';
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
			this.parent_div.insertAfter(entry, reference_node);

	}

	async getWordList(query:string): Promise<string | null> {

		var res = await request(
			{
				url: 'https://latinlexicon.org/ajax/lookup_json.php',
				method: "POST",
				contentType: "application/x-www-form-urlencoded",
				body: new URLSearchParams({p1: query}).toString()
			}
		);
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
					entry.innerHTML += "<a href='obsidian://obsidian-perseus?id="+option.id+"'>" + option.form + "</a>";
			}
			entry.innerHTML += "<br>&nbsp;<br>";

		}

		return entry;

	}

	async getEntry(query:string,dictionary:string): Promise<string | null> {
		if(dictionary == "latinlexicon")
			{
				return await this.getWordList(query);
			}
			try {

				var res = await fetch('https://www.perseus.tufts.edu/hopper/text\?doc\=Perseus%3Atext%3A'+dictionary+'%3Aentry%3D'+query);
				var text = await res.text();
				var parser = new DOMParser();
				var doc = parser.parseFromString(text, "text/html");
				var entry = doc.querySelector('.text_container');

				if(entry == null)
					{
						entry = document.createElement('p');
						entry.innerHTML = 'No results found for "'+query+'".';
						entry.innerHTML += "<hr>";
					} else {
						entry.innerHTML = entry.innerHTML.replace(/<\/?a[^>]*>/g, ""); // Remove links
						entry.innerHTML += "<hr>";
					}
					return entry;
			}
			catch (e) {
				console.log(e);
				return null;
			}
	}

	async getAndPopulateEntry(query:string): Promise<string | null> {

		var dictionary = this.perseus_select.getValue();
		var entry = await this.getEntry(query, dictionary);
		var reference_node = document.querySelector(".end-hr");
		console.log(entry);
		this.parent_div.insertAfter(entry, reference_node);

	}

	clearResults(): void {
		this.parent_div.empty();
		this.perseus_results = this.parent_div.createEl("p", {cls: 'perseus-results', html: "" });
		this.parent_div.createEl("hr", {cls: "end-hr"});
	}

	constructor(leaf: WorkspaceLeaf) {
		super(leaf);
		this.navigation = false; //openInCenter

	}

	onload(): void {

		// This is where we construct the HTML for the user interface.
		let style = `padding-left: 30px; padding-right: 30px;`;
		this.contentEl.setAttribute("style", style);
		this.contentEl.empty();
		this.contentEl.addClass("perseus-view");
		this.contentEl.createEl("h6", { text: "Latin Dictionary Browser" });
		const options: Record<ArchiveOptions, string> = {
			"1999.04.0060": "Elementary Lewis (Perseus)",
			"1999.04.0059": "Lewis & Short (Perseus)",
			"latinlexicon": "latinlexicon.org"
		};
		this.perseus_select = new DropdownComponent(this.contentEl).addOptions(options);
		this.contentEl.createEl("br", {});
		this.perseus_query = new TextComponent(this.contentEl).setPlaceholder("Enter query...");
		this.contentEl.createEl("br", {});
		this.perseus_submit = new ButtonComponent(this.contentEl).setButtonText("Look up");
		this.perseus_clear = new ButtonComponent(this.contentEl).setButtonText("Clear results");
		this.perseus_abbreviations = new ButtonComponent(this.contentEl).setButtonText("Explain abbreviations");
		this.parent_div = this.contentEl.createEl("div");
		this.perseus_results = this.parent_div.createEl("p", {cls: 'perseus-results', html: "" });
		this.parent_div.createEl("hr", {cls: "end-hr"});
		this.perseus_submit.onClick(async () => {
			await this.getAndPopulateEntry(this.perseus_query.getValue());
		});
		this.perseus_clear.onClick(async () => {
			this.clearResults();
		});
		this.perseus_abbreviations.onClick(async () => {
			var entry = await this.getAbbreviations();
			var reference_node = document.querySelector(".end-hr");
			this.parent_div.insertAfter(entry, reference_node);
		});
/*		this.perseus_select.onChange(async() => {
			var select_option = document.querySelector('.perseus-view select option:checked'); // Gotta add some save functionality for chosen option at some point
		});*/

	}


	getViewType() {
		return VIEW_TYPE;
	}

	getDisplayText() {
		return "Perseus Dictionary";
	}

	/*
		 onPaneMenu(menu: Menu, source: string): void {
		 super.onPaneMenu(menu, source);
		 for (let action of CustomFrameView.actions) {
		 menu.addItem(i => {
		 i.setTitle(action.name);
		 i.setIcon(action.icon);
		 i.onClick(() => action.action(this));
		 });
		 }
		 }*/

}
