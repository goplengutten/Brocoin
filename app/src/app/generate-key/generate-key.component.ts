import { Component, OnInit } from '@angular/core';
import { Response } from "@angular/http"
import { ServerService } from "../server.service";

@Component({
  selector: 'app-generate-key',
  templateUrl: './generate-key.component.html',
  styleUrls: ['./generate-key.component.css']
})
export class GenerateKeyComponent implements OnInit {
  key: string = "Keep this secret"
  address: string = "Share this with anyone"


  constructor(private serverService: ServerService) { }

  onGenerateKey(){
    this.serverService.generateKey()
    .subscribe((response: Response) => {
      let res = response.json()
      this.key = res.key
      this.address = res.address
    })
  }

  ngOnInit() {
  }

}
