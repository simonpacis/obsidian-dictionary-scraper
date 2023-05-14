import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';
import { DictionaryView } from "./view";

// Remember to rename these classes and interfaces!

interface ScraperSettings {
	defaultOption: integer;
}

const DEFAULT_SETTINGS: ScraperSettings = {
	defaultOption: 0
}

export default class DictionaryScraperPlugin extends Plugin {
	settings: ScraperSettings;

	async onload() {
		await this.loadSettings();

		this.registerObsidianProtocolHandler("obsidian-perseus", async (e) => { //obsidian://obsidian-perseus
			document.querySelector(".perseus-view").scrollTo(0,0);
			var view = this.app.workspace.getLeavesOfType('perseus-view')[0].view;
			var scraper = view.scrapers[e.key].class;
			scraper.protocolHandler(e.id);
		});

		this.registerView("perseus-view", l => new DictionaryView(l));
		this.addCommand({
			id: `open-${name}`,
			name: `Enable Dictionary Scraper in sidebar`,
			callback: () => this.openLeaf("perseus-view", false, false),
		});
	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	private async getView(name: string): Promise<DictionaryView>
	{
		let leaf: WorkspaceLeaf;
		if (!this.app.workspace.getLeavesOfType(name).length)
			await this.app.workspace.getRightLeaf(false).setViewState({ type: name, active: true });
		leaf = this.app.workspace.getLeavesOfType(name)[0];
		return leaf.view;
	}

	private async openLeaf(name: string, center: boolean, split: boolean): Promise<void> {
		let leaf: WorkspaceLeaf;
		if (!this.app.workspace.getLeavesOfType(name).length)
			await this.app.workspace.getRightLeaf(false).setViewState({ type: name, active: true });
		leaf = this.app.workspace.getLeavesOfType(name)[0];
		this.app.workspace.revealLeaf(leaf);
	}
}

