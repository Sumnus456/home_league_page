import {XMLParser, XMLValidator} from 'fast-xml-parser';
import { waitForAll } from '$lib/utils/helperFunctions/multiPromise';
import { json } from '@sveltejs/kit';

const FF_BALLERS= 'https://thefantasyfootballers.libsyn.com/fantasyfootball';
const ROTOWIRE= 'https://www.rotowire.com/rss/news.php?sport=NFL';
const ESPN= 'https://www.espn.com/espn/rss/nfl/news';

export async function GET() {
	const articles = [
        getXMLArticles(FF_BALLERS, processFF),
        getXMLArticles(ROTOWIRE, processRotowire),
        getXMLArticles(ESPN, processESPN),
	];
    const responses = await waitForAll(...articles).catch((err) => { console.error(err); });

	let finalArticles = [];

	for(const response of responses) {
		finalArticles = [...finalArticles, ...response];
	}

    return json(finalArticles);
}

const getXMLArticles = async(url, callback) => {
    const res = await fetch(url, {compress: true}).catch((err) => { console.error(err); });
    const text = await res.text().catch((err) => { console.error(err); });

    let xmlData;
    if(XMLValidator.validate(text) === true){
        const parser = new XMLParser();
        xmlData = parser.parse(text);
    }
    
    return callback(xmlData.rss.channel.item);
}

const processFF = (articles) => {
	let finalArticles = [];
	for(const article of articles.slice(0, 5)) {
		const ts = Date.parse(article.pubDate);
		const d = new Date(ts);
		const date = stringDate(d);
		const icon = 'newsIcons/ffballers.jpeg';
		finalArticles.push({
			title: article.title,
			article: article.description,
			link: article.link,
			author: `Fantasy Footballers`,
			ts,
			date,
			icon,
		});
	}
	return finalArticles;
}

const processFTN = (rawArticles) => {
	let finalArticles = [];
	const items = rawArticles.items;
	for(const article of items) {
		// only grab important info
		if(article.priority > 3) continue;
		const ts = Date.parse(article.datetime);
		const d = new Date(ts);
		const date = stringDate(d);
		const icon = 'newsIcons/ftn.png';
		finalArticles.push({
			title: article.short_text,
			article: article.text,
			link: `https://www.ftnfantasy.com/nfl${article.link}`,
			author: `FTN Fantasy`,
			ts,
			date,
			icon,
		});
	}
	return finalArticles;
}

const processRotowire = (articles) => {
	let finalArticles = [];
	for(const article of articles) {
		const ts = Date.parse(article.pubDate);
		const d = new Date(ts);
		const date = stringDate(d);
		const icon = 'newsIcons/rotowire.png';
		finalArticles.push({
			title: article.title,
			article: article.description,
			link: article.link,
			author: `Rotowire`,
			ts,
			date,
			icon,
		});
	}
	return finalArticles;
}

const processESPN = (articles) => {
	let finalArticles = [];
	for(const article of articles) {
		const ts = Date.parse(article.pubDate);
		const d = new Date(ts);
		const date = stringDate(d);
		const icon = 'newsIcons/espn.png';
		finalArticles.push({
			title: article.title,
			article: article.description,
			link: article.link,
			author: `ESPN`,
			ts,
			date,
			icon,
		});
	}
	return finalArticles;
}

const stringDate = (d) => {
	return `${d.getMonth()+1}/${d.getDate()}/${d.getFullYear()} ${d.getHours()}:${(d.getMinutes() < 10 ? '0' : '') + d.getMinutes()}`;
}