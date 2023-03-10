const puppeteer = require("puppeteer");
const fs = require("fs");
const Json2csvparser  = require('json2csv').Parser;

(async () => {
    websites=[
     "example.com"
   ];
   var firstIteration = true; 
   for(i=0;i<websites.length;i++){
       url=  websites[i];
       const browser = await puppeteer.launch({ headless: false });
       const page = await browser.newPage();
       await page.goto("https://www.similarweb.com/website/"+url+"/#overview");

       await new Promise(r => setTimeout(r, 10000));

       const dataContentElement = await page.$x(".//div[@class = 'data-content']");
       if (dataContentElement.length > 0) {
         Similarweb_Monthly_Traffic = await (await page.$("div[class = 'engagement-list'] > div:nth-child(1)")).evaluate(node => node.innerText.split('\n').splice(-1).join());

        //  Avg_Visit_Duration = await (await page.$("div[class = 'engagement-list'] > div:nth-child(4)")).evaluate(node => node.innerText.split('\n').splice(-1).join());
       } else {
         Similarweb_Monthly_Traffic = "No data";
        //  Avg_Visit_Duration = "No data";
       }

       data =[{Similarweb_Monthly_Traffic,Website:websites[i]}];

       if (firstIteration) {
           const fields = Object.keys(data[0]).join(',');
           await fs.appendFileSync('./newwork.csv', fields+'\n', 'utf-8');
           firstIteration = false;
       }
     
       const csv = Object.values(data[0]).join(',');
       console.log(csv);
       await fs.appendFileSync('./newwork.csv', csv+'\n', 'utf-8');
       browser.close();
   }
})();






