import { Injectable } from "@angular/core";
import { Http } from "@angular/http";

@Injectable()
export class ServerService{
  constructor(private http: Http){}
  
  newTransaction(transaction: object){
    return this.http.post("/api/newtransaction", transaction)
  }

  transactionHistoryOne(address: string){
    return this.http.get(`/api/transactionhistoryone?address=${address}`)
  }
  
  transactionHistoryAll(){
    return this.http.get(`/api/transactionhistoryall`)
  }

  generateKey(){
    return this.http.get("/api/generatekey")
  }

  getChainInfo(){
    return this.http.get("/api/chaininfo")
  }
  
  chainValidity(){
    return this.http.get("/api/checkvalidity")
  }

  getBalance(address: string){
    return this.http.get(`/api/getbalance?address=${address}`)
  }

  getBalances(){
    return this.http.get("/api/getbalances")
  }
}