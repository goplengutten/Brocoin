# Brocoin

A crypto currency to mine, trade and play around with. 

The project currently consists of two parts:

The miner folder, where the chain itself is located. This is where the blocks are mined and transactions approved. 

The app folder, where the interface is. This uses the chain api to place transactions and check information about the chain.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine.

### Prerequisites

You will need nodeJS, mongoDB and angular installed on your computer.

Go to the links below and follow the instructions

* [NodeJS](https://nodejs.org/en/)
* [MongoDB](https://www.mongodb.com/download-center?jmp=nav#community)

Install the MongoDB community server



Then open your command prompt and type the following instruction:

```
> npm install -g @angular/cli
```

To connect to mongoDB click the link below and follow instructions 1 and 2.
* [Connect to MongoDB](https://docs.mongodb.com/getting-started/shell/tutorial/install-mongodb-on-windows/#run-mongodb-community-edition)

Leave this running.



### Installing and running the project

Clone the repository and navigate into the 'app' folder in your command prompt.

Then run
```
> npm install

> ng build

> node server.js
```

Open a new command prompt and navigate into the 'miner' folder and run 

```
> npm install

> node createBlockchain.js
```

Go to localhost:3000 in your browser.

Go to the "Generate key" tab and generate a new key/address. Save both.

Open the miner.js file in the miner folder and add the address you just created to 'minerAddress = "your address here"'. This is the address that will get the reward for mining blocks.

To start mining on the newly created blockchain, run
```
> node server.js mine
```
You can also omit the "mine" argument to only use it as an API to the chain.

To delete the chain you can run 
```
> node createBlockchain.js drop
```

You should now have 3 command prompts running. Miner, app and mongo. Enjoy!



## TODO-list
This is a work in progress. Here is a list of the things to come.

* Add increasing mining difficulty and decreasing mining rewards
* A rollback mechanism that can restart the chain at the previous valid point in case the chain for some reason turns out invalid.
* A mechanism that lets miners speak to eachother and agree on approved blocks (Make it decentralized).
* Clean up the front end (Make the HTML responsive, fix a proper landing page etc).
* Finally, add a form of smart contracts for simple bets.

## Author
* **Stian Goplen**


