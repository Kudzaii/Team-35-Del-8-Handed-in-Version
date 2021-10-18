import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Client } from 'src/app/models/Client';
import { ClientsService } from '../../services/clients.service';
import { DataService } from '../../services/DataService.service';
import { Location } from '@angular/common'
@Component({
  selector: 'app-client-management',
  templateUrl: './client-management.component.html',
  styleUrls: ['./client-management.component.scss']
})
export class ClientManagementComponent implements OnInit {

  clients: Array<Client>;
  clicked = true;
  message:string;
  subscription: Subscription;
  public query: any = '';
  constructor(private clientsService:ClientsService,private data: DataService, private location: Location) { }

  ngOnInit() {
    this.clientsService.getClients().subscribe(res=>{
        this.clients = res

    })

  }

  Transfer(Name,Surname){
  this.clicked = false;
  let NameSurname =  Name +" "+ Surname
  this.data.changeMessage( NameSurname)
  }

  goBack(): void {
    this.location.back();
  }

}
