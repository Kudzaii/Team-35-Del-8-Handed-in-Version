import { Component, OnInit } from '@angular/core';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';
import Swal from 'sweetalert2';
import { TraineesService } from '../../services/trainees.service';
import { TrainerService } from '../../services/trainer.service';

@Component({
  selector: 'app-trainer-to-trainee',
  templateUrl: './trainer-to-trainee.component.html',
  styleUrls: ['./trainer-to-trainee.component.scss'],
})
export class TrainerToTraineeComponent implements OnInit {
  TraineesList:Array<any> = [];
  TrainerList:Array<any>  = [];
  isSelected = [false, false];
  isClosed = false;
  dropdownSettingsTrainee: IDropdownSettings = {};
  dropdownSettingsTrainer: IDropdownSettings = {};

  SelectedTrainer: any;
  SelectedTrainee: any;

  constructor(
    private traineeService: TraineesService,
    private trainerService: TrainerService,
    private snackbar: SnackbarService
  ) { }

  ngOnInit() {
    this.getTrainees();
    this.getTrainers();
  }

  getTrainees() {
    this.traineeService.getTrainees().subscribe((trainees) => {
      this.TraineesList = trainees;
      this.TraineesList.forEach((element) => {
        element.Name = element.Name + ' ' + element.Surname;
        if (element.Practitioner_ID != null) {
          element.isAssigned = true;
        }
        this.TraineesList.push(element);
        // Removes duplicates
        this.TraineesList = this.TraineesList.filter(function (
          elem,
          index,
          self
        ) {
          return index === self.indexOf(elem);
        });
      });
    });
    this.dropdownSettingsTrainee = {
      singleSelection: true,
      idField: 'Trainee_ID',
      textField: 'Name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true,
    };
  }

  getTrainers() {
    this.trainerService.getTrainers().subscribe((trainers) => {
      this.TrainerList = trainers;
      this.TrainerList.forEach((element) => {
        element.Name = element.Name + ' ' + element.Surname;
        this.TrainerList.push(element);
        // Removes duplicates
        this.TrainerList = this.TrainerList.filter(function (
          elem,
          index,
          self
        ) {
          return index === self.indexOf(elem);
        });
      });
    });
    this.dropdownSettingsTrainer = {
      singleSelection: true,
      idField: 'Trainer_ID',
      textField: 'Name',

      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true,
    };
  }
  /**
   * Properties for the select
   */
  onItemSelectTrainee(item: any) {
    console.log(item);
    this.isSelected[0] = true;
    this.SelectedTrainee = item;
  }

  onItemSelectTrainer(item: any) {
    console.log(item);
    this.SelectedTrainer = item;
    this.isSelected[1] = true;
  }
  /*** Removes element from array */
  onDeSelect(items: any) { }
  onDropDownClose(num?) {
    if (num == 2) {
      this.isClosed = true;
    }
  }

  AssignTrainerToTraineer() {
    Swal.fire({
      title: 'Are You Sure You Want To Assign This Trainer To This Trainee?',
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.isConfirmed) {
        let trainee = this.TraineesList.find(
          (obj) => obj.Trainees_ID == this.SelectedTrainee.Trainees_ID
        );
    
        this.trainerService
          .AssignTrainerToTrainee(
            this.SelectedTrainer.Trainer_ID,
            this.SelectedTrainee.Trainee_ID
          )
          .subscribe((res) => {
            console.log(res);
            this.snackbar.openSnackBar('Successfully Assigned Trainer to Trainee');
      })
      
    }
  })
    
      
  }

  checkIfTrainerIsAlreadyAssigned(users) {
/**
 * gonna check if trainer is assigned
 */
  }
}


