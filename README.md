# Overview 

This project is about analyzing tweets to gauge sentiments around Crypto Currency. This can be an useful tool to take trades on crypto currency based on sentiments. 

Twitter data is being analyzed for below 
1) hash tags related crypto currency
2) CashTags
3) Twitter handles (it include some of the early and influential crypto currency investors, government bodies etc.)
4) Different tweet properties like follower count, verified, number of retweet, user likes, tweet likes etc.

The approach is to find 'text sentiment score' based on - A method which look for both, polarity and intensity of the content for sentiment
analysis. This score is further smoothen/enhanced by additional tweet parameters mentioned above in point 4


# Technical Detail

Node.js based webserivce implemenation using [Express](https://expressjs.com/)

# How to run it 

Clone the repository 
```
git clone https://github.com/Swati0619/hack2018.git

```
Navigate to the parent folder `hack2018` 

run below command 
```
cd TwitterReader\backend
```
```
npm install
```
```
node .
```

