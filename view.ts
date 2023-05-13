import { ItemView, WorkspaceLeaf, Menu, ButtonComponent, TextComponent, DropdownComponent } from "obsidian";

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
			return entry;
		}
		catch (e) {
			console.log(e);
			return null;
		}
	}

	async getEntry(query:string,dictionary:string): Promise<string | null> {
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
		this.contentEl.createEl("h6", { text: "Perseus Dictionary" });
		const options: Record<ArchiveOptions, string> = {
			"1999.04.0060": "Elementary Lewis",
			"1999.04.0059": "Lewis & Short"
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
			this.clearResults();
			var entry = await this.getAbbreviations();
			var reference_node = document.querySelector(".end-hr");
			this.parent_div.insertAfter(entry, reference_node);
		});

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
