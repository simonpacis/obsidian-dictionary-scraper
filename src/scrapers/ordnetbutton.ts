import { Scraper } from "./scraper";

export class OrdnetButton extends Scraper {


	async onClick(): void
	{
		window.open('https://ordnet.dk', '_blank');
	}


}
