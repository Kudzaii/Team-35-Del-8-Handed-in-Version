import { Component, OnInit } from '@angular/core';
import { Client } from 'src/app/models/Client';
import { ClientsService } from '../../Admin/services/clients.service';
import { DataService } from '../../Admin/services/DataService.service';
import { PractitionerUserService } from '../services/PractitionerUser.service';
import { Location } from '@angular/common'
@Component({
  selector: 'app-send-client-task',
  templateUrl: './send-client-task.component.html',
  styleUrls: ['./send-client-task.component.scss']
})
export class SendClientTaskComponent implements OnInit {

  constructor(private data: DataService, private location: Location,private PractitionerUserservice:PractitionerUserService) { }
  clients:Array<Client>;

  ngOnInit() {
    this.PractitionerUserservice.ClientsAssignedToPractitoner().subscribe(res=>{
        this.clients = res
    })

  }

  Transfer(Name,Surname){
  let NameSurname =  Name +" "+ Surname
  this.data.changeMessage( NameSurname)
  }

  
goBack(): void {
  this.location.back();
}

}




