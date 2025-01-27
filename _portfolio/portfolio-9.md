---
title: "AI stock-trading algorithm in Python"
date: January 2025
excerpt: "Python algorithm that trains a long-short-term-memory (LSTM) machine-learning model on the past two years of stock data (hourly) for the S&P500 index with a variety of technical indicators as features to attempt to predict the price an hour in the future.<br/>"
collection: portfolio
---
I developed a Python algorithm that trains a long-short-term-memory (LSTM) machine-learning model on the past two years of stock data (hourly) for the S&P500 index with a variety of technical indicators as features to attempt to predict the price an hour in the future. I began by researching how stock metrics such as Relative Strength Index (RSI), Bollinger Bands, simple moving averages, and bid-ask imbalance affect a future stock's price. I used several of these indicators to train an ML model that is rigged to the Alpaca paper trading API so I can test in real time the model's profitability. When analyzed on the validation dataset, the model achieves significantly higher profitability than a simple buy-and-hold strategy. 

[Github Repository](https://github.com/dylan-jacobs/stock-prediction)
