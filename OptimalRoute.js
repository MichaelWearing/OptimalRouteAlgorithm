const fs = require("fs");
const csv = require("csv-parser");

const inputFile = "./input.csv";
const outputFile = "./output.csv";

const products = {};

const createWriteString = (
  bayAndShelfNode,
  productToBePickedUp,
  outputStream
) => {
  if (productToBePickedUp) {
    Object.entries(productToBePickedUp).forEach(([productCode, quantity]) => {
      const pickLocation = bayAndShelfNode;
      outputStream.write(`${productCode},${quantity},${pickLocation}\n`);
    });
  }
};

fs.createReadStream(inputFile)
  .pipe(csv())
  .on("data", (row) => {
    const { product_code, quantity, pick_location } = row;
    if (!products[pick_location]) {
      products[pick_location] = {};
    }
    if (!products[pick_location][product_code]) {
      products[pick_location][product_code] = 0;
    }
    products[pick_location][product_code] += Number(quantity);
  })
  .on("end", () => {
    const outputStream = fs.createWriteStream(outputFile);
    outputStream.write("product_code,quantity,pick_location\n");

    for (let bay = 0; bay < 52; bay++) {
      for (let shelf = 0; shelf < 10; shelf++) {
        if (bay >= 26) {
          const bayAndShelfNode = `A${String.fromCharCode(65 + bay - 26)} ${
            shelf + 1
          }`;
          const productToBePickedUp = products[bayAndShelfNode];
          createWriteString(bayAndShelfNode, productToBePickedUp, outputStream);
        } else {
          const bayAndShelfNode = `${String.fromCharCode(65 + bay)} ${
            shelf + 1
          }`;
          const productToBePickedUp = products[bayAndShelfNode];
          createWriteString(bayAndShelfNode, productToBePickedUp, outputStream);
        }
      }
    }

    outputStream.end();
  });
