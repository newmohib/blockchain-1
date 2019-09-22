const sha256= require("crypto-js/sha256")

class Block{
    constructor(timestamp,transactions,previousHash=""){
        this.timestamp=timestamp;
        this.transactions=transactions;
        this.previousHash=previousHash;
        this.hash=this.calculateHash();
        this.nonce=0;
    }
    minBlock(defficulty){
        while (this.hash.substring(0,defficulty) !== Array(defficulty +1).join("0")) {
            
            this.nonce++;
            this.hash=this.calculateHash()
        }
        console.log("Mining done :" + this.hash);
    }

    calculateHash(){
        return sha256(
            this.timestamp + JSON.stringify(this.transactions) + this.previousHash + this.nonce
        ).toString();
    }
}

class Transaction {
    constructor(fromAddress,toAddress,amount){
        this.fromAddress=fromAddress
        this.toAddress=toAddress
        this.amount=amount
    }
}

 class Blockchain{
    constructor(){
        this.chain=[this.generateGenesisBlock()];
        this.defficulty=5;
        this.pendingTransactions=[]
    }
    generateGenesisBlock(){
        return new Block("2019-01-01","Genesis","0000")
    }
    getLatestBlock(){
        return this.chain[this.chain.length -1]
    }
    createTransaction(transaction){
        this.pendingTransactions.push(transaction);
    }
    minePendingTransactions(){
        let block =new Block( Date.now(),this.pendingTransactions);
        block.minBlock(this.defficulty)
        this.chain.push(block);
        this.pendingTransactions=[]
    }
    // addBlock(newBlock){
    //     newBlock.previousHash=this.getLatestBlock().hash
    //     newBlock.minBlock(this.defficulty)
    //     this.chain.push(newBlock);
    // }

    isBlockchainValid(){
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i-1];
            
            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }

            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
            return true;
        }
    }

    getBalanceOfAddress(address){
        let balance=0;
        for(const block of this.chain){
            for (const trans of block.transactions) {
                 if (trans.fromAddress === address) {
                     balance -= trans.amount;
                 }
                 if (trans.toAddress === address) {
                    balance += trans.amount;
                }
            }
        }
        return balance;
    }
 }

const josscoin=new Blockchain();
josscoin.createTransaction(new Transaction("address1","address2",100))
josscoin.createTransaction(new Transaction("address2","address1",50))

josscoin.minePendingTransactions();
console.log(josscoin.getBalanceOfAddress("address1"));
console.log(josscoin.getBalanceOfAddress("address2"));
//console.log(josscoin);