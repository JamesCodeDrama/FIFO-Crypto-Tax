import * as fs from "fs";

interface CoinData {
  amount: number;
  value: number;
}

enum Mode {
  BUY = "B",
  SELL = "S",
}

const sumValueOfCoinData = (coins: { [key: string]: CoinData }): number => {
  let result = 0;
  Object.keys(coins).forEach((coinName) => {
    result += coins[coinName].value;
  });
  return result;
};

fs.readFile("transactions.txt", "utf8", (err, data) => {
  try {
    if (err) {
      console.error(err);
      return;
    }
    const transactions = data.split(/\r?\n/).map((item) => item.trim());
    const coins: { [key: string]: CoinData } = {};
    const notEnoughCoinsError = new Error("You do not have enough coins.");
    for (const t of transactions) {
      const [mode, name, priceString, amountString] = t.split(" ");
      const amount = parseFloat(amountString);
      const price = parseFloat(priceString);
      const value = price * amount;
      if (coins[name]) {
        switch (mode) {
          case Mode.BUY:
            coins[name].amount += amount;
            coins[name].value -= value;
            break;
          case Mode.SELL:
            if (coins[name].amount - amount < 0) {
              throw notEnoughCoinsError;
            }
            coins[name].amount -= amount;
            coins[name].value += value;
            break;
          default:
            break;
        }
      } else {
        switch (mode) {
          case Mode.BUY:
            coins[name] = { amount, value: -value };
            break;
          case Mode.SELL:
            throw notEnoughCoinsError;
          default:
            break;
        }
      }
    }
    console.log(sumValueOfCoinData(coins));
  } catch (err) {
    console.error(err);
  }
});
