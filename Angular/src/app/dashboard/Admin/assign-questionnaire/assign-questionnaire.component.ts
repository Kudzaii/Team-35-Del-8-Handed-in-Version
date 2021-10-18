import { Component, OnInit } from '@angular/core';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ClientsService } from '../services/clients.service';
import { QuestionnaireService } from '../services/Questionnaire.service';
import { trigger, transition, animate, style } from '@angular/animations';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';
import { forkJoin } from 'rxjs';
import { TraineesService } from '../services/trainees.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-assign-questionnaire',
  animations: [
    trigger('myInsertRemoveTrigger', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('100ms', style({ opacity: 1 })),
      ]),
      transition(':leave', [animate('100ms', style({ opacity: 0 }))]),
    ]),
  ],
  templateUrl: './assign-questionnaire.component.html',
  styleUrls: ['./assign-questionnaire.component.scss'],
  providers: [SnackbarService],
})
export class AssignQuestionnaireComponent implements OnInit {
  constructor(
    private questionnaireService: QuestionnaireService,
    private Clientservice: ClientsService,
    private snackbar: SnackbarService,
    private trainee: TraineesService,
    private location: Location
  ) {}

  dropdownList = [];
  previewListonQuestions = [];
  ClientList = [];
  Questions: Array<any> = [];
  dropdownSettings: IDropdownSettings = {};
  Client: any;
  QuestionsSelected: boolean=false;
  Steps: boolean[] = [false, false, false, false]; //Steps control
  isLoaded: boolean = false; // pre loader
  allSelected: boolean = false; //check of all of them are selected
  isLoader: boolean = false; //?submit loader
  isClients: boolean = true; //checks if its clients
  isTrainee: boolean = false; // checks if its trainee
  show = 4; //Number of shown sample questions
  Name: string = 'Client';

  ngOnInit() {
    this.getClients();
    this.getAllQuestions();
  }

  Toggle() {
    this.isClients = !this.isClients;
    this.isClients ? (this.Name = 'Client') : (this.Name = 'Trainee'); //if statement
    this.getClients()
  }

  getAllQuestions() {
    this.questionnaireService.GetAllQuestions().subscribe((res) => {
      this.dropdownList = res;
      console.log(res);
    });

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'QuestionTitle_ID',
      textField: 'QuestionTitle',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true,
    };
  }

  getClients() {
    if (this.isClients) {
      this.ClientList =[]
      this.Clientservice.getClients().subscribe((result) => {
        (this.ClientList =  result.filter(cl => cl.ClientStatus_ID != 2)), (this.Steps[0] = true);
        this.isLoaded = false;
      });
    } else {
      this.ClientList =[]
      this.trainee.getTrainees().subscribe((result) => {
        (this.ClientList = result.filter(trainee => trainee.TraineeStatus_ID == 1)), (this.Steps[0] = true);
        this.isLoaded = false;
      });
    }
  }

  /**
   * Properties for the select
   */
  onItemSelect(item: any) {
    let obj = this.dropdownList.find(
      (x) => x.QuestionTitle_ID === item.QuestionTitle_ID
    );
    console.log(obj);
    this.previewListonQuestions.push(obj);
    this.QuestionsSelected=true; // show example questions
    this.Questions.push(item.QuestionTitle_ID);
  }
  onSelectAll(items: any) {
    this.Questions = items;
    this.allSelected = true;
  }
  /*** Removes element from array */
  onDeSelect(items: any) {
    const index = this.Questions.indexOf(items.QuestionTitle_ID);
    if (index > -1) {
      this.Questions.splice(index, 1);
      this.previewListonQuestions.splice(index, 1);
      this.allSelected = false // checks if all of options are selected
    }
  }
  onDropDownClose() {
    this.NextStep(2);
  }

  NextStep(step, client?) {
    console.log(this.Client)
    if (step == 1) {
      this.Client;
      this.Steps[1] = true;
    } else if (step == 2) {
      this.Steps[2] = true;
    } else if (step == 3) {
      this.Steps[3] = true;
    }
  }

  async AssignClient() {
    this.isLoader = true;
    //Reassigning ID
    let ID = this.Client.Client_ID;
    if (!this.isClients) {
      ID = this.Client.Trainee_ID;
    }


      this.questionnaireService
        .AssignTraineeQuestionnaires(
          ID,
          this.Questions,
          this.isClients
        )
        .subscribe((response) => {
          this.Steps = [] = [false, false, false, false];
          this.getClients();
          this.isLoader = false;
          this.QuestionsSelected=false;
          this.snackbar.openSnackBar('Questionnaire successfully loaded');
        });

  }

  async delay(ms: number) {
    await new Promise<void>((resolve) => setTimeout(() => resolve(), ms)).then(
      () => console.log('fired')
    );
  }

  goBack(): void {
    this.location.back();
  }  
}
