"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
var Mode;
(function (Mode) {
    Mode["BUY"] = "B";
    Mode["SELL"] = "S";
})(Mode || (Mode = {}));
const sumValueOfCoinData = (coins) => {
    let result = 0;
    Object.keys(coins).forEach((coinName) => {
        result += coins[coinName].value;
    });
    return result;
};
fs.readFile('transactions.txt', 'utf8', (err, data) => {
    try {
        if (err) {
            console.error(err);
            return;
        }
        const transactions = data.split(/\r?\n/).map(item => item.trim());
        const coins = {};
        for (const t of transactions) {
            const [mode, name, priceString, amountString] = t.split(' ');
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
                            throw new Error('You do not have enough coins.');
                        }
                        coins[name].amount -= amount;
                        coins[name].value += value;
                        break;
                    default:
                        break;
                }
            }
            else {
                switch (mode) {
                    case Mode.BUY:
                        coins[name] = { amount, value: -value };
                        break;
                    case Mode.SELL:
                        throw new Error('You do not have enough coins.');
                    default:
                        break;
                }
            }
        }
        console.log(sumValueOfCoinData(coins));
    }
    catch (err) {
        console.error(err);
    }
});
