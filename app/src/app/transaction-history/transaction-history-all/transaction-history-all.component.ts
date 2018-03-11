import { Component, OnInit } from '@angular/core';
import { ServerService } from "../../server.service";
import { Response } from "@angular/http"

@Component({
  selector: 'app-transaction-history-all',
  templateUrl: './transaction-history-all.component.html',
  styleUrls: ['./transaction-history-all.component.css']
})
export class TransactionHistoryAllComponent implements OnInit {

  transactions: any[]
  fetched: boolean = false

  constructor(private serverService: ServerService) { }

  ngOnInit() {
    this.serverService.transactionHistoryAll()
    .subscribe((response: Response) => {
      let res = response.json()
      this.fetched = true
      this.transactions = res.transactions
    })
  }

}
