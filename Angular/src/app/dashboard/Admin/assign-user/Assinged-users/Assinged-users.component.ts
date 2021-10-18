import { Component, OnInit } from '@angular/core';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ClientsService } from '../../services/clients.service';
import { PractitionerService } from '../../services/practitioner.service';
import Swal from 'sweetalert2';
import { Client } from 'src/app/models/Client';
@Component({
  selector: 'app-Assinged-users',
  templateUrl: './Assinged-users.component.html',
  styleUrls: ['./Assinged-users.component.scss']
})
export class AssingedUsersComponent implements OnInit {
  ClientList = [];
  PractitionerList = [];
  isSelected = [false, false];
  selectedValue:any;
  isClosed = false;
  dropdownSettings: IDropdownSettings = {};
  showBranch:boolean
  dropdownSettingsPractitioner: IDropdownSettings = {};
  Users:Array<any> = [];
  constructor(
    private clientservice: ClientsService,
    private practitionerservice: PractitionerService,
  ) { }

  ngOnInit() {
    this.getUsers();
    this.getPractitioners();
  }


  getUsers() {
    this.clientservice.ViewClientsWithPractitioner().subscribe((users) => {
      this.Users = users;

    });

  }


  getPractitioners() {
    this.practitionerservice.getPractitioners().subscribe((practitioners) => {
      this.PractitionerList = practitioners;
      this.PractitionerList.forEach((element) => {
        element.Name = element.Name + ' ' + element.Surname;
        this.PractitionerList.push(element);
        // Removes duplicates
        this.PractitionerList = this.PractitionerList.filter(function (elem, index, self) {
          return index === self.indexOf(elem);
        });
      });
    });
    this.dropdownSettingsPractitioner = {
      singleSelection: true,
      idField: 'Practitioner_ID',
      textField: 'Name',

      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true,
    };
  }
  changeBranchToggle() {
    this.showBranch = !this.showBranch;
  }

  AssignPractitioner(Practitioner,Client_ID) {

      console.log(Practitioner, ">>>>>>",Client_ID)
    // this.practitionerservice.AssignPractitionerToClient(Practitioner_ID,Client_ID).subscribe(res=>{
    //   console.log(res);
    //   Swal.fire({
    //     position: 'top-end',
    //     icon: 'success',
    //     title: 'Your work has been saved',
    //     showConfirmButton: false,
    //     timer: 1500
    //   })
    // }, error =>{})
  }

  onDropDownClose(num?) {
    this.getUsers()
  }
}
