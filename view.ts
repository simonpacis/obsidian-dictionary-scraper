import { ItemView, WorkspaceLeaf, Menu, ButtonComponent, TextComponent, DropdownComponent, request } from "obsidian";
import { PerseusLemScraper } from "./perseuslem";
import { PerseusLnsScraper } from "./perseuslns";
import { LatinLexiconScraper } from "./latinlexicon";
import { LatinLexiconAbbreviationsScraper } from "./latinlexiconabbreviations";

export const VIEW_TYPE = "perseus-view";
export const SCRAPERS =
	{
		"perseuslem":
			{
				'class': new PerseusLemScraper,
				'name': 'Elementary Lewis (Perseus)',
				'language': 'Latin'
			},
		"perseuslns":
			{
				'class': new PerseusLnsScraper,
				'name': 'Lewis and Short (Perseus)',
				'language': 'Latin'
			},
		"latinlexicon":
			{
				'class': new LatinLexiconScraper,
				'name': 'latinlexicon.org',
				'language': 'Latin'
			},
		"latinlexiconabbreviations":
		{
			'class': new LatinLexiconAbbreviationsScraper,
		}
	};

export class DictionaryView extends ItemView {

	clearResults(): void {
		this.parent_div.empty();
		this.perseus_results = this.parent_div.createEl("p", {cls: 'perseus-results', html: "" });
		this.parent_div.createEl("hr", {cls: "end-hr"});
	}

	constructor(leaf: WorkspaceLeaf) {
		super(leaf);
		this.scrapers = SCRAPERS;
		this.navigation = false; //openInCenter

	}

	onload(): void {

		// This is where we construct the HTML for the user interface.
		let style = `padding-left: 30px; padding-right: 30px;`;
		this.contentEl.setAttribute("style", style);
		this.contentEl.empty();
		this.contentEl.addClass("perseus-view");
		this.contentEl.createEl("h6", { text: "Latin Dictionary Browser" });
		var options: Record<ArchiveOptions, string> = {};
		var scraper_keys = Object.keys(SCRAPERS);
		for(var i = 0; i < scraper_keys.length; i++)
		{
			var scraper =  this.scrapers[scraper_keys[i]];
			if(scraper.hasOwnProperty('name'))
				{
			options[scraper_keys[i]] = scraper.name;
				}
		}
		this.perseus_select = new DropdownComponent(this.contentEl).addOptions(options);
		this.contentEl.createEl("br", {});
		this.perseus_query = new TextComponent(this.contentEl).setPlaceholder("Enter query...");
		this.contentEl.createEl("br", {});
		this.perseus_submit = new ButtonComponent(this.contentEl).setButtonText("Look up");
		this.perseus_clear = new ButtonComponent(this.contentEl).setButtonText("Clear results");
		this.perseus_abbreviations = new ButtonComponent(this.contentEl).setButtonText("Explain abbreviations");
		this.parent_div = this.contentEl.createEl("div", {cls:'dictionary-scraper-parent-div'});
		this.perseus_results = this.parent_div.createEl("p", {cls: 'perseus-results', html: "" });
		this.parent_div.createEl("hr", {cls: "end-hr"});
		this.perseus_submit.onClick(async () => {
			var scraper = this.scrapers[this.perseus_select.getValue()];
			await scraper.class.getAndPrintEntry(this.perseus_query.getValue());
		});
		this.perseus_clear.onClick(async () => {
			this.clearResults();
		});
		this.perseus_abbreviations.onClick(async () => {
			var scraper = this.scrapers['latinlexiconabbreviations'].class;
			await scraper.getAndPrintAbbreviations();
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
