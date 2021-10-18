import { Component, OnInit } from '@angular/core';
import { Trainee } from 'src/app/models/Trainee';
import { TrainerService } from '../../services/trainer.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-trainers',
  templateUrl: './trainers.component.html',
  styleUrls: ['./trainers.component.scss']
})
export class TrainersComponent implements OnInit {
  public query: any = '';
  trainers:Array<any>
  constructor( private TrainersService:TrainerService) { }

  ngOnInit() {
    this.TrainersService.getTrainers().subscribe(res=>{
      this.trainers =  res.filter(trainee => trainee.TrainerStatus_ID ==1)
  })
  }
  getList(){
    this.TrainersService.getTrainers().subscribe(res=>{
      this.trainers = res
  })
  }

  DisableTrainer(ID){
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })

    swalWithBootstrapButtons.fire({
      title: 'Are You Sure Want To Disable This Trainer?',
      text: "You Won't Be Able To Revert This!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.TrainersService.DisableTrainer(ID).subscribe(res=>{
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
