# Develop a Scraper, a Tutorial
We will be developing a scraper for ordnet.dk, a dictionary for the Danish language.

## Step 0: Clone and prepare

1. Clone the repository locally to your machine.
2. Run `npm install`
3. Go to `src` and run `npm run dev`

## Step 1: Create file
1. In `src/scrapers`, create a new file for your scraper. We will call it `ordnet.ts`.
2. We will copy the following scraper skeleton for a scraper using the Lookup-process (see README.md), giving the scraper-class the name "OrdnetScraper".

```typescript
import { ItemView, WorkspaceLeaf, Menu, ButtonComponent, TextComponent, DropdownComponent, request } from "obsidian";
import { Scraper } from "./scraper";

export class OrdnetScraper extends Scraper {

	async getEntry(query:string): Promise<string | null> {
		try {

		}
		catch (e) {
			console.log(e);
			return null;
		}
	}

	async getAndPrintEntry(query:string): void
	{
		var entry = await this.getEntry(query);
		super.printEntry(entry);
	}


}
```

## Step 2: Get URL
1. Go to ordnet.dk and search a query to get the URL we need for the scraper.

<img width="1680" alt="Screen Shot 2023-05-15 at 8 09 54 AM" src="https://github.com/simonpacis/obsidian-dictionary-scraper/assets/7118482/2853f709-12de-4530-89a8-1d4ef4fa2036">

2. The URL for the query "fjer" becomes: `https://ordnet.dk/ddo/ordbog?query=fjer&tab=for`
3. In the try-clause in the `getEntry` method we call the `getEntry` method of the parent-class, passing in the URL to the ordnet-site, replacing "fjer" in the query with the query-variable passed into the getEntry-method.

```typescript

try {
  var text = await super.getEntry('https://ordnet.dk/ddo/ordbog?query='+query+'&tab=for');
}

```

## Step 3: Scrape information
1. Now that we have the HTML for the page, we have to scrape out the definition. Using developer tools on the page, we get the necessary query selector for the element.

<img width="1680" alt="Screen Shot 2023-05-15 at 8 14 28 AM" src="https://github.com/simonpacis/obsidian-dictionary-scraper/assets/7118482/2c3de610-873f-4302-9821-fa35728cac5a">

2. The query is then pretty simple, and becomes ".artikel".
3. Below the call to super.getEntry we now call the method `parseElement` of the parent-class, passing in the HTML as parameter 1, the query-selector as parameter 2, and the query itself as parameter 3.

```typescript

try {
  var text = await super.getEntry('https://ordnet.dk/ddo/ordbog?query='+query+'&tab=for');
  var entry = super.parseElement(text, ".artikel", query);
}

```
4. Now we just have to return the entry, and the scraper is done!

## Step 4: Return entry
1. Return the entry.

```typescript
try {
  var text = await super.getEntry('https://ordnet.dk/ddo/ordbog?query='+query+'&tab=for');
  var entry = super.parseElement(text, ".artikel", query);
  return entry;
}
```

## Step 4: Import and add to SCRAPERS-constant
1. Open the `view.ts`-file.
2. Import the scraper.

```typescript
import { OrdnetScraper } from "./scrapers/ordnet";
```

3. Having now developed and imported the scraper, we have to tell the plugin where to find it. In `view.ts`, we have the constant "SCRAPERS" defined near the top of the file. To it we add a new entry:

```typescript
export const SCRAPERS =
	{
  ...
		"ordnet":
			{
				'class': new OrdnetScraper,
				'type': 'option',
				'name': 'ordnet.dk',
				'language': 'Danish'
			}
   ...
    };
```

## Step 5: Reload Obsidian and use your scraper
1. go to `View -> Force Reload`
2. Your scraper is ready for use.

<img width="1680" alt="Screen Shot 2023-05-15 at 8 22 32 AM" src="https://github.com/simonpacis/obsidian-dictionary-scraper/assets/7118482/e09d8930-be01-443f-8411-0f4c0677e40d">

## Step 6: Room for improvement
The result includes some broken HTML-elements. A way to improve this simple scraper would be by cleaning up the HTML in `getEntry` before returning it.
