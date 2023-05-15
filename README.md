# Obsidian Dictionary Scraper

*NOTE: Primarily personal project, use if you like.*
 
This plugin takes a query and looks up said query in a given online dictionary. It does this by scraping the website and presenting the definition neatly in the right sidebar of Obsidian. It is relatively straightforward to develop new scrapers, too. Tutorial upcoming.

<img width="1680" alt="Screen Shot 2023-05-15 at 7 43 32 AM" src="https://github.com/simonpacis/obsidian-dictionary-scraper/assets/7118482/f011a3aa-da72-4742-ad02-cb7c4550f72a">

# Current Scrapers

| Scraper          | Website                         | Language | Process  |   
|------------------|---------------------------------|----------|----------|
| Elementary Lewis | http://perseus.tufts.edu/hopper | Latin    | Lookup   |   
| Lewis & Short    | http://perseus.tufts.edu/hopper | Latin    | Lookup   |   
| latinlexicon.org | http://latinlexicon.org         | Latin    | Wordlist |   
| ordnet.dk        | http://ordnet.dk                | Danish   | Lookup   |   

## Processes
### Lookup
Enter the word you want to look up - if word is found, definition will be returned.

### Wordlist
A list of words matching the query will be returned. Click on the desired word to get definition. 

# Installation

## Via BRAT

- Install BRAT from Community Plugins in Obsidian
- Open Command Palette and run the command "BRAT: Add a beta plugin for testing"
- Use the following link: https://github.com/simonpacis/obsidian-perseus-dictionary 
- Click "Add Plugin"
- Go to Community Plugins, refresh, and enable Angry Reviewer

