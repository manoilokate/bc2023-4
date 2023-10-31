const http = require('http');
const fs = require('fs');
const { XMLParser, XMLBuilder } = require('fast-xml-parser');

const host = 'localhost';
const port = 8000;
const xmlData = 'data.xml';

const requestListener = function (req, res) {
    const parserXML = new XMLParser();
    const builderXML = new XMLBuilder();

    fs.readFile(xmlData, (err, data) => {
        if (err) {
            handleError(400, "Error reading file!");
            return;
        }
        
        const xmlData = data.toString();
        const readyParseData = parserXML.parse(xmlData);

        const finalData = readyParseData.indicators.inflation.filter(it => it.ku == 13 && it.value > 5);

        const result = [];
        for (const item of finalData) {
            result.push(item['value']);
        }
        
        const obj = builderXML.build({'data': {'value': result}});
        
        res.setHeader('Content-Type', 'text/xml');
        res.writeHead(200);
        res.end(obj);
    });
};

const server = http.createServer(requestListener);

server.listen(port, host, () => {
    console.log(`Server running at host: ${host} and port: ${port}`);
});
