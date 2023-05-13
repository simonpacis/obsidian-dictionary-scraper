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

	async onload() {
		await this.loadSettings();
		this.registerView("perseus-view", l => new DictionaryView(l));
		this.addCommand({
			id: `open-${name}`,
			name: `Enable Perseus Dictionary in sidebar`,
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

