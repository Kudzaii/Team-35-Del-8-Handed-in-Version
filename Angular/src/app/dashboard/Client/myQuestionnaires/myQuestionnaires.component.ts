import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { ClientService } from '../services/client.service';
import { Location } from '@angular/common';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-myQuestionnaires',
  templateUrl: './myQuestionnaires.component.html',
  styleUrls: ['./myQuestionnaires.component.scss']
})
export class MyQuestionnairesComponent implements OnInit {

  constructor(private clientService: ClientService,private auth:AuthService, private location: Location) { }
 myQuestionnaires=[];
 questionContainer = [];
 arrayLengthCheck:any;
 ArrayOfQuestions = Array.from(Array(null,null), () => new Array(null,null))
  ngOnInit() {

    this.clientService.ClientQuestionnaire().subscribe(res=>{
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

  hint() {
    var x = document.getElementById("snackbar");
    x.className = "show";
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 8000);
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
    Swal.fire({
      title: "By Selecting Yes You Will Complete Your Questionnaire.",
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.isConfirmed) {
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
     if(canSubmit) this.clientService.CompleteQuestionnaire(this.ArrayOfQuestions).subscribe(response =>{
       console.log(response)
     })
  }
    })
  }
  goBack(): void {
    this.location.back();
  }
}

