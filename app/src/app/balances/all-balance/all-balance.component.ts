import { Component, OnInit } from '@angular/core';
import { ServerService } from "../../server.service";
import { Response } from "@angular/http"

@Component({
  selector: 'app-all-balance',
  templateUrl: './all-balance.component.html',
  styleUrls: ['./all-balance.component.css']
})
export class AllBalanceComponent implements OnInit {

  accounts: any[] = []
  fetched: boolean = false

  constructor(private serverService: ServerService) { }


  ngOnInit() {
    this.serverService.getBalances()
    .subscribe((response: Response) => {
      this.fetched = true
      let res = response.json()
      this.accounts = res    
    })
  }
}
