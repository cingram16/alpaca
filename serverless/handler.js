const TradingSignals = require('trading-signals');
const Alpaca = require('@alpacahq/alpaca-trade-api');

const alpaca = new Alpaca({
    keyId: process.env.keyId,
    secretKey: process.env.secretKey,
    paper: process.env.paper,
    usePolygon: process.env.usePolygon
  });

const barTimeframe = "15Min"
let assetsToTrade = []

module.exports.buy = async (event) => {

  // check if market is open
  const clock = await alpaca.getClock();

  if(clock.is_open) {
    // start by canceling any pre-existing orders
    console.log('Cancel all orders')
    await alpaca.cancelAllOrders();

    assetsToTrade = await getAssetsToTrade();

    for(const assetSymbol of assetsToTrade) {
      if(await isBuy(assetSymbol)) {
        console.log(`${assetSymbol} - buy`)
        buyPosition(assetSymbol)
      } else {
        console.log(`${assetSymbol} - sell`)
        sellPosition(assetSymbol)
      }
    }
  }
};

function getAssetsToTrade() {
  return new Promise((resolve, reject) => {
    let assetsToWatch = [];

    alpaca.getWatchlists().then((watchlists) => {
      return alpaca.getWatchlist(watchlists[0].id)
    }).then((watchlist) => {
      for(const asset of watchlist.assets) {
        assetsToWatch.push(asset.symbol)
      }
      resolve(assetsToWatch)
    }).catch((err) => {
      reject(err)
    })
  })
}

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

async function buyPosition(assetSymbol) {
  try {
    await alpaca.getPosition(assetSymbol).catch((err) => {
      throw new Error()
    })
  } catch (err) {
        // position doesn't exist yet so buy
        let cash_balance = 0
        let price = -1

        await alpaca.getAccount().then((account) => cash_balance = account.cash)
        await alpaca.getBars("minute", assetSymbol, {limit: 1}).then((bars) => price = bars[assetSymbol][0].closePrice)

        const positionSizing = 100 / assetsToTrade.length / 100
        const qty = cash_balance / (price / positionSizing)

    
        alpaca.createOrder({
          symbol: assetSymbol,
          qty: parseInt(qty),
          side: 'buy',
          type: 'market',
          time_in_force: 'gtc'
        })
        .then((response) => console.log(response))
        .catch((err) => console.log(err))
  }
}

async function sellPosition(assetSymbol) {
  alpaca.getPosition(assetSymbol).then((position) => {
    return alpaca.createOrder({
            symbol: assetSymbol,
            qty: position.qty,
            side: 'sell',
            type: 'market',
            time_in_force: 'gtc'
          })
  }).then((response) => console.log(response))
    .catch((err) => console.log('Position doesnt exist, skip sell'))
}