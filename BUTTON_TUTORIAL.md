# Develop a Button, a Tutorial
We will be developing a button for the Latin scrapers, which will explain abbreviations when clicked on.

## Step 0: Clone and prepare

1. Clone the repository locally to your machine.
2. Go to `src`
3. Run `npm install`
4. Run `npm run dev`

## Step 1: Create file
1. In `src/scrapers`, create a new file for your scraper. We will call it `latinlexiconabbreviations.ts`.
2. We will copy the following button skeleton for a button-class, giving it the name "LatinLexiconAbbreviationsScraper".

```typescript
import { ItemView, WorkspaceLeaf, Menu, ButtonComponent, TextComponent, DropdownComponent, request } from "obsidian";
import { Scraper } from "./scraper";

export class LatinLexiconAbbreviationsScraper extends Scraper {

	async onClick(): void
	{
	
	}


}
```

When the button is clicked, it is the `onClick`-method that will be called.

## Step 2: Plan what the button will do
This button will fetch the text from the `#main_container` element of `https://latinlexicon.org/LEM_abbreviations.php` and output it.

## Step 3: Fetch data
See this step from the [scraper tutorial](https://github.com/simonpacis/obsidian-dictionary-scraper/blob/master/SCRAPER_TUTORIAL.md#step-2-get-url). Only relevant if your button will fetch outside data.

Our class now looks like this:


```typescript
...
export class LatinLexiconAbbreviationsScraper extends Scraper {

	async getAbbreviations(): Promise<string | null> {
		try {

			var text = await super.getEntry('https://latinlexicon.org/LEM_abbreviations.php');
			var entry = super.parseElement(text, "#main_container");
			entry = super.removeLinks(entry);

			entry.innerHTML = "Fetched from: <a href='https://latinlexicon.org/LEM_abbreviations.php'>https://latinlexicon.org/LEM_abbreviations.php</a><br>&nbsp;<br>" + entry.innerHTML; 
			return entry;
		}
		catch (e) {
			console.log(e);
			return null;
		}
	}
...
```

This code fetches the data from the URL and returns it after prepending a text with a link to the page from which the data was scraped.

## Step 3: onClick method
Finally, we add some code to the `onClick`-method.

```typescript
async onClick(): void
{
	var entry = await this.getAbbreviations();
	super.printEntry(entry, true, false);
}
```

## Step 4: Import and add to SCRAPERS-constant
1. Open the `view.ts`-file.
2. Import the button.

```typescript
import { LatinLexiconAbbreviationsScraper } from "./scrapers/latinlexiconabbreviations";
```

3. Having now developed and imported the button, we have to tell the plugin where to find it. In `view.ts`, we have the constant "SCRAPERS" defined near the top of the file. To it we add a new entry:

```typescript
export const SCRAPERS =
{
...
	"latinlexiconabbreviations":
		{
			'class': new LatinLexiconAbbreviationsScraper,
			'type': 'button',
			'scraper': ['perseuslns', 'perseuslem', 'latinlexicon'],
			'label': 'Explain abbreviations'
		}
...
};
```

### The `scraper`-property
This property identifies when the button should appear. It can be either a string or an array.

If it is a string, the button will only appear when said scraper is selected. If it is an array it will appear when either of the scrapers are selected.


## Step 5: Reload Obsidian and use your scraper
1. go to `View -> Force Reload`
2. Your button is ready for use.
