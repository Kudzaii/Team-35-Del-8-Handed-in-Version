import { Component, OnInit } from '@angular/core';
import { Trainee } from 'src/app/models/Trainee';
import { TraineesService } from '../../services/trainees.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-trainees',
  templateUrl: './trainees.component.html',
  styleUrls: ['./trainees.component.scss']
})
export class TraineesComponent implements OnInit {
  public query: any = ''
  trainees:Array<Trainee>
  constructor( private TraineesService:TraineesService) { }

  ngOnInit() {
    this.TraineesService.getTrainees().subscribe(res=>{
      this.trainees = res.filter(trainee => trainee.TraineeStatus_ID ==1)

  })
  }
  getList(){
    this.TraineesService.getTrainees().subscribe(res=>{
      this.trainees = res
  })
  }

  DisableTrainee(ID){
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })

    swalWithBootstrapButtons.fire({
      title: 'Are You Sure Want To Disable This Trainee?',
      text: "You Won't Be Able To Revert This!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {

        this.TraineesService.DisableTrainee(ID).subscribe(res=>{
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
