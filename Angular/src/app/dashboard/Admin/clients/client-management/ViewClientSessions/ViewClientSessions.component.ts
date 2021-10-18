import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ClientsService } from '../../../services/clients.service';
import { DataService } from '../../../services/DataService.service';
import { Location } from '@angular/common'

@Component({
  selector: 'app-ViewClientSessions',
  templateUrl: './ViewClientSessions.component.html',
  styleUrls: ['./ViewClientSessions.component.scss']
})
export class ViewClientSessionsComponent implements OnInit,OnDestroy  {

  Sessions: Array<any>;
  ClientID:any;
  message:string;
  subscription: Subscription;

  constructor(private clientsService:ClientsService, private Arouter:ActivatedRoute,private data: DataService, private location: Location) { }

  ngOnInit() {
    this.subscription = this.data.currentMessage.subscribe(message => this.message = message)

    this.ClientID =  Number(this.Arouter.snapshot.params.id);
    this.clientsService.getClientSessions(this.ClientID).subscribe(res=>{
        this.Sessions = res

    })
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  goBack(): void {
    this.location.back();
  }

}
