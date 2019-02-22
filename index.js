const fs = require('fs');
const http = require('http');
const url = require('url');
/*
- readFileSync -> runs as a block, or synchronously
- on 1 line/thread once when app is started
*/
const json = fs.readFileSync(`${__dirname}/data/data.json`, 'utf-8');
const laptopData = JSON.parse(json);



// SPINNING UP A SERVER
const server = http.createServer((req, res) => {

    const pathName = url.parse(req.url, true).pathname;
    const id = url.parse(req.url, true).query.id;

    // PRODUCT OVERVIEW ROUTE
    if (pathName === '/products' || pathName === '/') {
        res.writeHead(200, { 'Content-type': 'text/html' });

        // readFile -> runs multi-threaded, or Asynchronously
        fs.readFile(`${__dirname}/templates/template-overview.html`, 'utf-8', (err, data) => {

            let overviewOutput = data;

            fs.readFile(`${__dirname}/templates/template-card.html`, 'utf-8', (err, data) => {
                const cardsOutput = laptopData.map(el => replaceTemplate(data, el)).join('');

                overviewOutput = overviewOutput.replace('{%CARDS%}', cardsOutput)
                res.end(overviewOutput);
            });
        });


    }

    // LAPTOP DETAIL ROUTE
    else if (pathName === '/laptop' && id < laptopData.length) {
        res.writeHead(200, { 'Content-type': 'text/html' });

        // readFile -> runs multi-threaded, or Asynchronously
        fs.readFile(`${__dirname}/templates/template-laptop.html`, 'utf-8', (err, data) => {
            const laptop = laptopData[id]
            const output = replaceTemplate(data, laptop);

            res.end(output);
        });
    }

    // IMAGES ROUTE
    // RegEx to match the images in fs
    else if ((/\.(jpg|jpeg|png|gif)$/i).test(pathName)) {
        // fs will read the image and serve it back as a response on the server
        // readFile -> runs multi-threaded, or Asynchronously
        fs.readFile(`${__dirname}/data/img${pathName}`, (err, data) => {
            res.writeHead(200, { 'Content-type': 'image.jpg' });
            res.end(data);
        });

    }

    // URL NOT FOUND
    else {
        res.writeHead(404, { 'Content-type': 'text/html' });
        res.end('URL was NOT found on the server!');
    }

});


function replaceTemplate(originalHtml, laptop) {
    let output = originalHtml.replace(/{%PRODUCTNAME%}/g, laptop.productName);

    output = output.replace(/{%IMAGE%}/g, laptop.image);
    output = output.replace(/{%PRICE%}/g, laptop.price);
    output = output.replace(/{%SCREEN%}/g, laptop.screen);
    output = output.replace(/{%CPU%}/g, laptop.cpu);
    output = output.replace(/{%STORAGE%}/g, laptop.storage);
    output = output.replace(/{%RAM%}/g, laptop.ram);
    output = output.replace(/{%DESCRIPTION%}/g, laptop.description);
    output = output.replace(/{%ID%}/g, laptop.id);

    return output;
};


server.listen(1337, '127.0.0.1', () => {
    console.log('Server is Listening for requests now on PORT: 1337');
});
