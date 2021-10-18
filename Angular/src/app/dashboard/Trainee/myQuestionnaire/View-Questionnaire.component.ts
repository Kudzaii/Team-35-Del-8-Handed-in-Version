import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { TrainerService } from '../../Trainer/services/trainer.service';
import { TraineeService } from '../services/trainee.service';
import { Location } from '@angular/common';
@Component({
  selector: 'app-View-Questionnaire',
  templateUrl: './View-Questionnaire.component.html',
  styleUrls: ['./View-Questionnaire.component.scss']
})
export class ViewQuestionnaireComponent implements OnInit {


  constructor(private traineeservice: TraineeService,private auth:AuthService,private location: Location) { }
 myQuestionnaires=[];
 questionContainer = [];
 arrayLengthCheck:any;
 ArrayOfQuestions = Array.from(Array(null,null), () => new Array(null,null))
  ngOnInit() {

    this.traineeservice.TraineeQuestionnaire().subscribe(res=>{
        console.log(res)
        let Pack = Object.keys(res).map((index) => {
          this.myQuestionnaires = res[index];
        });
        this.myQuestionnaires.forEach(element => {

          if(this.questionContainer.find(e => e.id == element.QuestionTitle_ID)== null)
          {
              let temp = {
                id: element.QuestionTitle_ID,
                question: element.QuestionTitle_Description
              }
              this.questionContainer.push(temp)
          }
        });
        this.CreateTwoDimensionalQuestionsArray();
    })


  }

   filterById(id) {

    this.arrayLengthCheck = this.myQuestionnaires.filter( x => x.QuestionTitle_ID === id);
    console.log( this.arrayLengthCheck)
    return this.arrayLengthCheck;
  }

  CreateTwoDimensionalQuestionsArray() {
    this.questionContainer.forEach(element => {
     let temp = [this.auth.loginId,element.id,]
     this.ArrayOfQuestions.push(temp);
    })

    this.ArrayOfQuestions.splice(0, 2); //pre removes initialized arrays

    console.log(this.ArrayOfQuestions)
  }

  assignAnswerToArray(Answer,index,arrayPosition){
    arrayPosition = this.ReassigningArrayPosition(arrayPosition)
    if(this.ArrayOfQuestions[index][arrayPosition] !=undefined)
    {
      this.ArrayOfQuestions[index][arrayPosition] =Number(Answer)
    }else{
      this.ArrayOfQuestions[index].push(Number(Answer));
    }

    console.log(this.ArrayOfQuestions)
  }

  ReassigningArrayPosition(numb: number){
    let temp:number;
    if(numb==0){
      temp=2;
    }
    else if(numb==1){
      temp=3;
    }
    else if(numb==2){
      temp=4;
    }
    else if(numb==3){
      temp=5;
    }
    return temp
  }

  submitQuestionnaire(){
    let canSubmit= true
    this.ArrayOfQuestions.forEach(array=>{
      let index =this.questionContainer.findIndex(x => x.id === array[1]);
      if(array.length == 6 || array.length == 3)
      {
        this.questionContainer[index].isNotCompleted=false;
      }
      else{
        canSubmit=false;
        this.questionContainer[index].isNotCompleted=true;
      }
    })
     if(canSubmit) this.traineeservice.CompleteQuestionnaire(this.ArrayOfQuestions).subscribe(response =>{
       console.log(response)
     })
  }
  goBack(): void {
    this.location.back();
  }
}



