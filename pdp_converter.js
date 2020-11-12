'use strict';


const { Parser } = require('json2csv');
const writeFile = require('fs').writeFile;
const fs = require('fs');
const category = "vodka";


 fs.readFile('./pdp_logs/'+category+'/'+category+'.json', (err, data) => {
    if(err) throw err;
    var beverages = JSON.parse(data);

//access json file
let jsonData = beverages[0].data;

var brandArray = [];
var priceArray = [];
var descriptionArray = [];
var imageArray = [];
   jsonData.forEach(element => {
       element.data.forEach(element2 => {
        element2.data.forEach(element3 => {
                element3.data.forEach(element4 => {
                    switch(element4.name) {
                        case "Brand": 
                          brandArray.push(element4.data[0]);
                          break;
                        case "Price":
                            priceArray.push(element4.data[0]);
                          break;
                        case "Description":
                            descriptionArray.push(element4.data[0]);
                          break;
                        case "Image":
                            let imagePath = element4.data[0].address;
                            let splitImagepath = imagePath.split("/");
                            let imageName = brandArray[brandArray.length-1];
                            imageName = imageName.replace(" ", "-");
                            let whatever = splitImagepath[splitImagepath.length-1];
                            fs.rename('./pdp_images/'+category+'/'+ whatever, './pdp_images/'+category+'/'+imageName+'.jpg', function(err){
                             if(err){
                               console.log('error: '+err);
                             }
                            });
                            imageArray.push(imageName + ".jpg");
                          break;
                        default:
                      }
            
                   })
        })
       }) 
   });

var result = [];
for(let i = 0; i < brandArray.length; i++){

    result.push({brand: '', product_name: brandArray[i], size: '', price: priceArray[i], product_type: 'Wine', category: category, varietal_style: 'Pinot Grigio', description: descriptionArray[i], sku: '', upc: '', image: imageArray[i] });
}
const fields = ['brand', 'product_name', 'size', 'price', 'product_type', 'category', 'varietal_style', 'description', 'sku', 'upc', 'image'];
const opts = { fields };
try {
  const parser = new Parser(opts);
  const csv = parser.parse(result);
  
  writeFile('./pdp_logs/'+category+'-data.csv', csv, (err) => {
    if(err) {
        console.log(err); 
        throw new Error(err);
    }
    console.log('Success!');
});
} catch (err) {
  console.error(err);
}
} )


 




 






