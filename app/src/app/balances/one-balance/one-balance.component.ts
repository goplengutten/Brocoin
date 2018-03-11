import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ServerService } from "../../server.service";
import { Response } from "@angular/http"

@Component({
  selector: 'app-one-balance',
  templateUrl: './one-balance.component.html',
  styleUrls: ['./one-balance.component.css']
})
export class OneBalanceComponent implements OnInit {
  @ViewChild("f") addressForm: NgForm

  balance: number
  mined: number
  address: string
  sent: number
  received: number
  fetched: boolean = false
  
  constructor(private serverService: ServerService) { }

  onSubmit(){
    this.address = this.addressForm.value.address
    this.serverService.getBalance(this.addressForm.value.address)
    .subscribe((response: Response) => {
      let res = response.json()
      this.fetched = true
      this.balance = res.balance
      this.mined = res.mined
      this.sent = res.sent
      this.received = res.received
      this.addressForm.reset()
    })
  }

  ngOnInit() {
  }

}
