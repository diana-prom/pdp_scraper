
const { Scraper, Root, DownloadContent, OpenLinks, CollectContent } = require('nodejs-web-scraper');
const fs = require('fs');
const { create } = require('domain');
const category = "vodka";

(async () => {

    const config = {
        baseSiteUrl: `https://sample.com/vodka/`,
        startUrl: `https://sample.com/vodka/`,
        filePath: './pdp_images/'+ category,
        concurrency: 3,//Maximum concurrent jobs. More than 10 is not recommended. Default is 3.
        maxRetries: 2,//The scraper will try to repeat a failed request few times(excluding 404). Default is 5.
        logPath: './pdp_logs/' + category,//Highly recommended: Creates a friendly JSON for each operation object, with all the relevant data.
    }

    const pages = [];

    const getPageObject = async (pageObject) => {
        await Promise.resolve()
        pages.push(pageObject)
    }

    const condition = (cheerioNode) => {
        const text = cheerioNode.text().trim();
        if(text === 'Vodka'){
            return true
        }
    }

    const scraper = new Scraper(config);

    const root = new Root();

    
    const main = new OpenLinks('a.nav-item', {name: category, condition, pagination: {queryString: 'p', begin: 1, end:13}});
    const productDP = new OpenLinks('a.item', {name: 'PDP'}, getPageObject)
    const product = new CollectContent('h1.product-name', {name: 'Brand'});
    const price = new CollectContent('h4.orderForm-price', {name: 'Price'});
    const description = new CollectContent('div.product-description--mobile p', {name: 'Description'});
    const image = new DownloadContent('img.active-image_gallery-image', {name:'Image'});
    

    root.addOperation(main);
    main.addOperation(productDP);
    productDP.addOperation(product);
    productDP.addOperation(price);
    productDP.addOperation(description);
    productDP.addOperation(image);
    await scraper.scrape(root);

    fs.writeFile('./'+category +'.json', JSON.stringify(pages), () => { })

})();