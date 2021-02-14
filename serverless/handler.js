const TradingSignals = require('trading-signals');
const Alpaca = require('@alpacahq/alpaca-trade-api');

const alpaca = new Alpaca({
    keyId: process.env.keyId,
    secretKey: process.env.secretKey,
    paper: process.env.paper,
    usePolygon: process.env.usePolygon
  });

const barTimeframe = "15Min"
const assetsToTrade = ["SPT", "SPY", "AAPL", "AMZN", "TSLA", "GME"]
const positionSizing = 100 / assetsToTrade.length / 100

module.exports.buy = async (event) => {

  // check if market is open
  const clock = await alpaca.getClock();

  if(clock.is_open) {
    // start by canceling any pre-existing orders
    console.log('Cancel all orders')
    await alpaca.cancelAllOrders();

    for(const assetSymbol of assetsToTrade) {
      if(await isBuy(assetSymbol)) {
        console.log(`buying ${assetSymbol}`)
      } else {
        console.log(`selling ${assetSymbol}`)
      }
    }
  }
};

async function isBuy(assetSymbol) {
  const sma80 = new TradingSignals.SMA(80);
  const sma200 = new TradingSignals.SMA(200);
  
  await alpaca.getBars(barTimeframe, assetSymbol, {limit: 400}).then((response) => {
    for(const bar of response[assetSymbol]) {
      sma80.update(bar.closePrice)
      sma200.update(bar.closePrice)
    }
  })

  // with moving averages the sma80 will be closer 
  const MA80 = sma80.getResult().valueOf()
  const MA200 = sma200.getResult().valueOf()
  
  return MA80 > MA200
}