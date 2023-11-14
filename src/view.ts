import { ItemView, WorkspaceLeaf, Menu, ButtonComponent, TextComponent, DropdownComponent, request } from "obsidian";
import { PerseusLemScraper } from "./scrapers/perseuslem";
import { PerseusLnsScraper } from "./scrapers/perseuslns";
import { LatinLexiconScraper } from "./scrapers/latinlexicon";
import { LatinLexiconAbbreviationsScraper } from "./scrapers/latinlexiconabbreviations";
import { OrdnetScraper } from "./scrapers/ordnet";
import { OrdnetButton } from "./scrapers/ordnetbutton";
import { EnacademicScraper } from "./scrapers/enacademic";

export const VIEW_TYPE = "perseus-view";
export const SCRAPERS =
	{
	"perseuslem":
		{
		'class': new PerseusLemScraper,
		'type': 'option',
		'name': 'Elementary Lewis (Perseus)',
		'language': 'Latin'
	},
	"perseuslns":
		{
		'class': new PerseusLnsScraper,
		'type': 'option',
		'name': 'Lewis and Short (Perseus)',
		'language': 'Latin'
	},
	"latinlexicon":
		{
		'class': new LatinLexiconScraper,
		'type': 'option',
		'name': 'latinlexicon.org',
		'language': 'Latin'
	},
	"enacademic":
		{
		'class': new EnacademicScraper,
		'type': 'option',
		'name': 'en-academic.com',
		'language': 'Greek'
	},
	"ordnet":
		{
		'class': new OrdnetScraper,
		'type': 'option',
		'name': 'ordnet.dk',
		'language': 'Danish'
	},
	"latinlexiconabbreviations":
		{
		'class': new LatinLexiconAbbreviationsScraper,
		'type': 'button',
		'scraper': ['perseuslns', 'perseuslem', 'latinlexicon'],
		'label': 'Explain abbreviations'
	},
	"ordnetbutton":
		{
		'class': new OrdnetButton,
		'type': 'button',
		'scraper': 'ordnet',
		'label': 'Åbn ordnet.dk'
	}
};

export class DictionaryView extends ItemView {

	constructor(leaf: WorkspaceLeaf) {
		super(leaf);
		this.scrapers = SCRAPERS;
		this.navigation = false; //openInCenter

	}

	clearResults(): void {
		this.parent_div.empty();
		this.perseus_results = this.parent_div.createEl("p", {cls: 'perseus-results', html: "" });
		this.parent_div.createEl("hr", {cls: "end-hr"});
	}

	getLanguages(): array {
		var languages = [];
		var scrapers_keys = Object.keys(this.scrapers);
		for(var i = 0; i < scrapers_keys.length; i++)
		{
			var scraper = this.scrapers[scrapers_keys[i]];
			if((!languages.includes(scraper.language)) && scraper.hasOwnProperty('language'))
				{
					languages.push(scraper.language);
				}
		}
		return languages;

	}

	getScrapersWhereLanguageIs(language:string): Object<string, any> {
		var scraper_keys = Object.keys(this.scrapers);
		var scrapers = {}; 
		for(var i = 0; i < scraper_keys.length; i++)
		{
			var scraper = this.scrapers[scraper_keys[i]];

			if((scraper.hasOwnProperty('language')) && (this.prepareShortLanguage(scraper.language) == language))
				{
					scrapers[scraper_keys[i]] = scraper;
				}
		}
		return scrapers;
	}


	getButtonScrapersWhereLanguageIs(language:string): Object<string, any> {
		var scraper_keys = Object.keys(this.scrapers);
		var scrapers = {}; 
		for(var i = 0; i < scraper_keys.length; i++)
		{
			var scraper = this.scrapers[scraper_keys[i]];

			if((scraper.hasOwnProperty('type')) && (scraper.type == "button"))
				{

					if((scraper.hasOwnProperty('language')) && (this.prepareShortLanguage(scraper.language) == language))
						{
							scrapers[scraper_keys[i]] = scraper;
						}
				}
		}
		return scrapers;
	}


	getButtonScrapersForScraper(selected_scraper:string): Object<string, any> {
		var scraper_keys = Object.keys(this.scrapers);
		var scrapers = {};
		for(var i = 0; i < scraper_keys.length; i++)
		{
			var scraper = this.scrapers[scraper_keys[i]];


			if((scraper.hasOwnProperty('type')) && (scraper.type == "button"))
				{
					if((scraper.hasOwnProperty('scraper')))
						{
							if(typeof scraper.scraper == "object") // Array
								{
									if(scraper.scraper.includes(selected_scraper))
										{
											scrapers[scraper_keys[i]] = scraper;
										}
								} else if(typeof scraper.scraper == "string")
									{
										if(scraper.scraper == selected_scraper)
											{
												scrapers[scraper_keys[i]] = scraper;
											}
									}
						}
				}
		}
		return scrapers;
	}

	prepareShortLanguage(language:string): string {

		return language.replace(/[^0-9a-z]/gi, '').toLowerCase();
	}

	addOptions(options: Object<string, string>, element:HTMLElement): void {

		var option_html = "";
		var option_keys = Object.keys(options);
		for(var i = 0; i < option_keys.length; i++)
		{
			var option = options[option_keys[i]];
			option_html += "<option value='"+option_keys[i]+"'>"+option+"</option>";

		}
		element.innerHTML = option_html;

	}


	populateLanguageOptions(): void {
		var options: Record<ArchiveOptions, string> = {};
		var languages = this.getLanguages();
		var scraper_keys = Object.keys(this.scrapers);
		for(var i = 0; i < languages.length; i++)
		{
			options[this.prepareShortLanguage(languages[i])] = languages[i];
		}
		this.addOptions(options, this.language_select.selectEl);

	}

	populateDictionaryOptions(): void {
		this.perseus_select.innerHTML = "";
		var options: Record<ArchiveOptions, string> = {};
		var scrapers = this.getScrapersWhereLanguageIs(this.language_select.getValue());
		var scraper_keys = Object.keys(scrapers);
		for(var i = 0; i < scraper_keys.length; i++)
		{
			var scraper =  scrapers[scraper_keys[i]];
			if(scraper.type == "option")
				{
					options[scraper_keys[i]] = scraper.name;
				}
		}
		this.addOptions(options, this.perseus_select.selectEl);
	}

	populateCustomButtons(contentEl:HTMLElement, scraper:string): void {

		var button_div = contentEl.querySelector(".dictionary-scraper-button-div");
		button_div.innerHTML = "";

		var button_scrapers = this.getButtonScrapersForScraper(scraper);
		var button_scraper_keys = Object.keys(button_scrapers);

		for(var i = 0; i < button_scraper_keys.length; i++)
		{
			var button_scraper = button_scrapers[button_scraper_keys[i]];
			var button = new ButtonComponent(button_div).setButtonText(button_scraper.label);
			button.onClick(async() => { button_scraper.class.onClick() });
		}

	}


	onload(): void {

		// This is where we construct the HTML for the user interface.
		let style = `padding-left: 30px; padding-right: 30px;`;
		this.contentEl.setAttribute("style", style);
		this.contentEl.empty();
		this.contentEl.addClass("perseus-view");
		this.contentEl.createEl("h6", { text: "Dictionary Scraper" });
		this.language_select = new DropdownComponent(this.contentEl);
		this.populateLanguageOptions();
		this.perseus_select = new DropdownComponent(this.contentEl);
		this.populateDictionaryOptions();
		this.contentEl.createEl("br", {});
		this.perseus_query = new TextComponent(this.contentEl).setPlaceholder("Enter query...");
		this.contentEl.createEl("br", {});
		this.perseus_submit = new ButtonComponent(this.contentEl).setButtonText("Look up");
		this.perseus_clear = new ButtonComponent(this.contentEl).setButtonText("Clear results");

		this.button_div = this.contentEl.createEl("div", {cls:'dictionary-scraper-button-div'});

		this.parent_div = this.contentEl.createEl("div", {cls:'dictionary-scraper-parent-div'});
		this.perseus_results = this.parent_div.createEl("p", {cls: 'perseus-results', html: "" });
		this.parent_div.createEl("hr", {cls: "end-hr"});

		var button_div = document.createElement('div');
		button_div.className = "dictionary-scraper-button-div";

		var reference_node = document.querySelector(".end-hr");
		var parent_div = window.document.querySelector(".dictionary-scraper-parent-div"); 


		this.populateCustomButtons(this.contentEl, this.perseus_select.getValue());

		this.perseus_submit.onClick(async () => {
			var scraper = this.scrapers[this.perseus_select.getValue()];
			await scraper.class.getAndPrintEntry(this.perseus_query.getValue());
		});
		this.perseus_clear.onClick(async () => {
			this.clearResults();
		});
		this.perseus_query.inputEl.addEventListener("keydown", async (event) => {
			if(event.code == "Enter")
				{
			var scraper = this.scrapers[this.perseus_select.getValue()];
			await scraper.class.getAndPrintEntry(this.perseus_query.getValue());
				}
		});
			this.language_select.onChange(async () => {
				this.populateDictionaryOptions();
				this.populateCustomButtons(this.contentEl, this.perseus_select.getValue());
			});
			this.perseus_select.onChange(async () => {
				this.populateCustomButtons(this.contentEl, this.perseus_select.getValue());
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
