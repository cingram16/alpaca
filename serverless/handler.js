const Alpaca = require('@alpacahq/alpaca-trade-api');
const alpaca = new Alpaca({
    keyId: process.env.keyId,
    secretKey: process.env.secretKey,
    paper: process.env.paper,
    usePolygon: process.env.usePolygon
  });

module.exports.buy = async (event) => {

};

module.exports.sell_limit = async (event) => {
  
};
