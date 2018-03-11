import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ServerService } from "../server.service";
import { Response } from "@angular/http"


@Component({
  selector: 'app-new-transaction',
  templateUrl: './new-transaction.component.html',
  styleUrls: ['./new-transaction.component.css']
})
export class NewTransactionComponent implements OnInit {
  @ViewChild("f") transactionForm: NgForm

  status: string = ""
  constructor(private serverService: ServerService) { }



  onSubmit(){
    this.status = "waiting for server response"
    this.serverService.newTransaction(this.transactionForm.value)
    .subscribe((response: Response) => {
      let res = response.json()
      this.status = res.message
      this.transactionForm.reset()
    })
  }

  ngOnInit() {
  }
}
