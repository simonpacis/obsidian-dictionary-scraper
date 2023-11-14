# Obsidian Dictionary Scraper

*NOTE: Primarily personal project, use if you like.*
 
This plugin takes a query and looks up said query in a given online dictionary.
It does this by scraping the website and presenting the definition neatly in the right sidebar of Obsidian.
It is relatively straightforward to develop new scrapers and buttons, too, see tutorials [SCRAPER_TUTORIAL.md](https://github.com/simonpacis/obsidian-dictionary-scraper/blob/master/SCRAPER_TUTORIAL.md) and [BUTTON_TUTORIAL.md](https://github.com/simonpacis/obsidian-dictionary-scraper/blob/master/BUTTON_TUTORIAL.md)

<img width="1680" alt="Screen Shot 2023-05-15 at 8 38 10 AM" src="https://github.com/simonpacis/obsidian-dictionary-scraper/assets/7118482/00ffed8d-c7f6-43f0-89d4-898c62f88c95">


# Current Scrapers

| Dictionary       | Website                         | Language | Process  |   
|------------------|---------------------------------|----------|----------|
| Elementary Lewis | http://perseus.tufts.edu/hopper | Latin    | Lookup   |   
| Lewis & Short    | http://perseus.tufts.edu/hopper | Latin    | Lookup   |   
| latinlexicon.org | http://latinlexicon.org         | Latin    | Wordlist |   
| ordnet.dk        | http://ordnet.dk                | Danish   | Lookup   |   
| en-academic.com  | https://en-academic.com/        | Greek    | Wordlist |   

## Processes
### Lookup
Enter the word you want to look up - if word is found, definition will be returned.

### Wordlist
A list of words matching the query will be returned.
Click on the desired word to get definition.


# Installation

## Via BRAT

- Install BRAT from Community Plugins in Obsidian
- Open Command Palette and run the command "BRAT: Add a beta plugin for testing"
- Use the following link: https://github.com/simonpacis/obsidian-dictionary-scraper
- Click "Add Plugin"
- Go to Community Plugins, refresh, and enable Angry Reviewer

