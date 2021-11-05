import { Component, OnInit } from '@angular/core';
import { Client } from 'src/app/models/Client';
import { ClientsService } from '../../Admin/services/clients.service';
import { DataService } from '../../Admin/services/DataService.service';
import { PractitionerUserService } from '../services/PractitionerUser.service';
import { Location } from '@angular/common'
import { FileUpload } from 'src/app/models/fileupload';
@Component({
  selector: 'app-send-client-task',
  templateUrl: './send-client-task.component.html',
  styleUrls: ['./send-client-task.component.scss']
})
export class SendClientTaskComponent implements OnInit {

  constructor(private data: DataService, private location: Location,private PractitionerUserservice:PractitionerUserService) { }
  clients:Array<Client>;
  url = '';
    // ProfilePictureUpload
  currentPPUpload: FileUpload;
  selectedPPFiles: FileList;
  //CV
  selectedTFiles: FileList;
  currentCVUpload: FileUpload;

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
selectFile2(event) {
  this.selectedTFiles = event.target.files;
  }
  uploads() {
    const filePP = this.selectedPPFiles.item(0);
    this.currentPPUpload = new FileUpload(filePP);
    this.selectedPPFiles = undefined;
    //CV
      const file = this.selectedTFiles.item(0);
      this.selectedTFiles = undefined;
      this.currentCVUpload = new FileUpload(file);
      return
    }
}





