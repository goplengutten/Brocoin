import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';


import { ServerService } from './server.service';

import { AppComponent } from './app.component';
import { InformationComponent } from './information/information.component';
import { HomeComponent } from './home/home.component';
import { TransactionHistoryComponent } from "./transaction-history/transaction-history.component"
import { TransactionHistoryAllComponent } from './transaction-history/transaction-history-all/transaction-history-all.component';
import { NewTransactionComponent } from './new-transaction/new-transaction.component';
import { TransactionHistoryOneComponent } from './transaction-history/transaction-history-one/transaction-history-one.component';
import { BalancesComponent } from "./balances/balances.component"
import { OneBalanceComponent } from './balances/one-balance/one-balance.component';
import { AllBalanceComponent } from './balances/all-balance/all-balance.component';
import { GenerateKeyComponent } from './generate-key/generate-key.component';

const appRoutes: Routes = [
  { path: "", component: HomeComponent },
  { path: "generatekey", component: GenerateKeyComponent },  
  { path: "newtransaction", component: NewTransactionComponent },  

  { path: 'transactionhistory', redirectTo: 'transactionhistory/one', pathMatch: 'full' },
  { path: "transactionhistory", component: TransactionHistoryComponent, children: [
    { path: "one", component: TransactionHistoryOneComponent },
    { path: "all", component: TransactionHistoryAllComponent },
  ] },
  { path: 'balances', redirectTo: 'balances/one', pathMatch: 'full' },
  { path: "balances", component: BalancesComponent, children: [
    { path: "one", component: OneBalanceComponent },
    { path: "all", component: AllBalanceComponent },
  ] },
  { path: "information", component: InformationComponent },
  { path: '*', redirectTo: '', pathMatch: 'full' },

]

@NgModule({
  declarations: [
    AppComponent,
    InformationComponent,
    HomeComponent,
    TransactionHistoryComponent,
    NewTransactionComponent,
    TransactionHistoryOneComponent,
    TransactionHistoryAllComponent,
    BalancesComponent,
    OneBalanceComponent,
    AllBalanceComponent,
    GenerateKeyComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    HttpModule,
    FormsModule
  ],
  providers: [
    ServerService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
