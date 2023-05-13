import { Platform } from "obsidian";
import { CustomFrameSettings, CustomFramesSettings, getId } from "./settings";

export class DictionaryFrame {

	private frame: HTMLIFrameElement | any;

	constructor() {
	}

	create(parent: HTMLElement): void {
		let frameDoc = parent.doc;
		this.frame = frameDoc.createElement("webview");
		parent.appendChild(this.frame);

	}

	refresh(): void {
		if (this.frame instanceof HTMLIFrameElement) {
			this.frame.contentWindow.location.reload();
		} else {
			this.frame.reload();
		}
	}

	return(): void {
		if (this.frame instanceof HTMLIFrameElement) {
			this.frame.contentWindow.open(this.data.url);
		} else {
			this.frame.loadURL(this.data.url);
		}
	}

	goBack(): void {
		if (this.frame instanceof HTMLIFrameElement) {
			this.frame.contentWindow.history.back();
		} else {
			this.frame.goBack();
		}
	}

	goForward(): void {
		if (this.frame instanceof HTMLIFrameElement) {
			this.frame.contentWindow.history.forward();
		} else {
			this.frame.goForward();
		}
	}

	toggleDevTools(): void {
		if (!(this.frame instanceof HTMLIFrameElement)) {
			if (!this.frame.isDevToolsOpened()) {
				this.frame.openDevTools();
			} else {
				this.frame.closeDevTools();
			}
		}
	}

	getCurrentUrl(): string {
		return this.frame instanceof HTMLIFrameElement ? this.frame.contentWindow.location.href : this.frame.getURL();
	}

	focus(): void {
		if (this.frame instanceof HTMLIFrameElement) {
			this.frame.contentWindow.focus();
		} else {
			this.frame.focus();
		}
	}
}
