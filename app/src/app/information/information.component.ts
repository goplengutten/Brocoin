import { Component, OnInit, OnDestroy } from '@angular/core';
import { ServerService } from "../server.service";
import { Response } from "@angular/http"

@Component({
  selector: 'app-information',
  templateUrl: './information.component.html',
  styleUrls: ['./information.component.css']
})
export class InformationComponent implements OnInit {

  length: number
  latestAdded: Date
  genesisAdded: Date
  currentDifficulty: number
  valid: boolean
  counter: number = 0
  interval
  infoFetched: boolean = false
  validFetched: boolean = false

  constructor(private serverService: ServerService) { }

  onCheckStatus(){
    this.checkStatus()
  }

  checkStatus(){
    
    this.counter = 0
    clearInterval(this.interval)
    this.interval = setInterval(() => {
      this.counter += 1
    }, 1000)

    this.serverService.getChainInfo()
      .subscribe((response: Response) => {
        let res = response.json()
        this.infoFetched = true
        this.genesisAdded = res.genesisAdded
        this.latestAdded = res.latestAdded
        this.currentDifficulty = res.difficulty
        this.length = res.length
      })
    this.serverService.chainValidity()
      .subscribe((response: Response) => {
        let res = response.json()
        this.validFetched = true
        this.valid = res.valid
      })
  }

  ngOnInit() {
    this.checkStatus()
  }

  ngOnDestroy(){
    clearInterval(this.interval)
  }
}
