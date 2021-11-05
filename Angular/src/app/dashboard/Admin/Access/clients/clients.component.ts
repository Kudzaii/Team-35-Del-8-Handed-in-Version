import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Client } from 'src/app/models/Client';
import { ClientsService } from '../../services/clients.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss']
})
export class ClientsComponent implements OnInit {
  clients: Array<Client>;
  clicked = true;
  message:string;
  public query: any = '';

  constructor(private clientsService:ClientsService, private router:Router) { }

  ngOnInit() {
   this.getList();

  }

  getList(){
    this.clientsService.getClients().subscribe(res=>{
      this.clients = res
  })
  }
  DisableClient(ID){

    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })

    swalWithBootstrapButtons.fire({
      title: 'Are You Sure Want To Disable This Client?',
      text: "You Won't Be Able To Revert This!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {

        this.clientsService.DisableClient(ID).subscribe(res=>{
          swalWithBootstrapButtons.fire(
            'Disabled!',
            'User Has Been Successfully Disabled.',
            'success'
          )
        }, err => { })

        this.getList();
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {

      }
    })

  }

  onSubmit(Email) {
    let Email_Address = {
      Email_Address:Email.Username
    }
  }

}
