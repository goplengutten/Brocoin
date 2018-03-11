import { Component, OnInit, ViewChild } from '@angular/core';
import { ServerService } from '../../server.service';
import { NgForm } from '@angular/forms';
import { Response } from "@angular/http"


@Component({
  selector: 'app-transaction-history-one',
  templateUrl: './transaction-history-one.component.html',
  styleUrls: ['./transaction-history-one.component.css']
})
export class TransactionHistoryOneComponent implements OnInit {
  @ViewChild("f") addressForm: NgForm

  address: string 
  transactionsSent: any[] = []
  transactionsReceived: any[] = []
  fetched: boolean = false

  constructor(private serverService: ServerService) { }

  onSubmit(){
    this.address = this.addressForm.value.address

    this.serverService.transactionHistoryOne(this.addressForm.value.address)
    .subscribe((response: Response) => {
      let res = response.json()
      this.fetched = true
      this.transactionsSent = res.sent
      this.transactionsReceived = res.received
      this.addressForm.reset()

    })
  }
  ngOnInit() {
  }
}
