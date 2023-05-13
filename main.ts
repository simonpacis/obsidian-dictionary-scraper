import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';
import { DictionaryView } from "./view";
var artoo = require('artoo-js'),
	cheerio = require('cheerio');

// Remember to rename these classes and interfaces!

interface MyPluginSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
	mySetting: 'default'
}

export default class MyPlugin extends Plugin {
	settings: MyPluginSettings;

	async getEntry(query:string): Promise<string | null> {
		try {
			var res = await fetch('https://www.perseus.tufts.edu/hopper/text\?doc\=Perseus%3Atext%3A1999.04.0060%3Aentry%3D'+query);
			var text = await res.text();
			var $ = cheerio.load(text);
			artoo.setContext($);
			var entry = artoo.scrape(".text_container")[0];
			return entry;
		}
		catch (e) {
			console.log(e);
			return null;
		}
	}

	async onload() {
		await this.loadSettings();
		this.registerView("perseus-view", l => new DictionaryView(l));
		this.addCommand({
			id: `open-${name}`,
			name: `Open Perseus Dictionary`,
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

	private async openLeaf(name: string, center: boolean, split: boolean): Promise<void> {
		let leaf: WorkspaceLeaf;
		if (!this.app.workspace.getLeavesOfType(name).length)
			await this.app.workspace.getRightLeaf(false).setViewState({ type: name, active: true });
		leaf = this.app.workspace.getLeavesOfType(name)[0];
		this.app.workspace.revealLeaf(leaf);
	}
}

