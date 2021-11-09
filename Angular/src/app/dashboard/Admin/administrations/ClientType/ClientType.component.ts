import { Component, OnInit } from '@angular/core';
import { TypeService } from '../../services/type.service';
import { SimpleModalService } from 'ngx-simple-modal';
import { PromptComponent } from '../../../../shared/utils/modals/prompt/prompt.component';
import Swal from 'sweetalert2';
import { Location } from '@angular/common'
@Component({
  selector: 'app-ClientType',
  templateUrl: './ClientType.component.html',
  styleUrls: ['./ClientType.component.scss'],
})
export class ClientTypeComponent implements OnInit {
  clientTypes: Array<any>;
  public query: any = '';
  constructor(private typeService: TypeService,private SimpleModalService: SimpleModalService, private location: Location) {}
  ngOnInit(){
    this.getClientTypes()
  }
  getClientTypes() {
    this.typeService.GetTypes(6).subscribe((res) => {
      this.clientTypes = res;
    });
  }
  AddClientType() {

    this.SimpleModalService.addModal(PromptComponent, {
      title: 'Client Type',
      question: 'Add Your Client Type: ',
        message: ''
      })
      .subscribe((message) => {
        // We get modal result
          console.log(message);
          let client = {ClientType_Name:message }
          this.typeService.AddClientType(client).subscribe(response=>{
            this.getClientTypes()

          },
          error => {throw new Error('Client not added')})
      });
  }

  Maintain(clientType,Id) {
    this.SimpleModalService.addModal(PromptComponent, {
      title: 'Client Type',
      question: 'Update Client Type: ',
      message: clientType.toString()
    })
      .subscribe((message) => {
        // We get modal result
          console.log(message);
          let client = {ClientType_Name:message, ClientType_ID: Id }
          this.typeService.UpdateClientType(client,Id).subscribe(response=>{
            this.getClientTypes()
            this.typeService.success('client')

          }
          ,error => {throw new Error('Client Not Added '); console.log(error)})
      });
  }

  delete(id) {
    Swal.fire({
      title: 'Are You Sure You Want To Delete Client Type?',
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.isConfirmed) {
        this.typeService.RemoveclientType(id).subscribe(res=>{
          console.log(res);
          this.getClientTypes();
      })
      }
    }
    )}

    goBack(): void {
      this.location.back();
    }

}
    

