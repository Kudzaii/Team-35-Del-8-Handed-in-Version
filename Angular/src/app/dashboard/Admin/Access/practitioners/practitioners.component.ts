import { Component, OnInit } from '@angular/core';
import { Practitioner } from 'src/app/models/Practitioner';
import { PractitionerService } from '../../services/practitioner.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-practitioners',
  templateUrl: './practitioners.component.html',
  styleUrls: ['./practitioners.component.scss']
})
export class PractitionersComponent implements OnInit {
  public query: any = '';
  practitioners:Array<Practitioner>
  constructor( private practitionerService:PractitionerService) { }

  ngOnInit() {
    this.practitionerService.getPractitioners().subscribe(res=>{
      this.practitioners = res

  })
  }
  getList(){
    this.practitionerService.getPractitioners().subscribe(res=>{
      this.practitioners = res
  })
}
  DisablePractitioner(ID){

    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })

    swalWithBootstrapButtons.fire({
      title: 'Are You Sure Want To Disable This Practitioner?',
      text: "You Won't Be Able To Revert This!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {

        this.practitionerService.DisablePractitioner(ID).subscribe(res=>{
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
  }

