import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';;
import { TraineeService } from '../services/trainee.service';
import { TaskDialogComponent } from './taskDialog/taskDialog.component';
import { Location } from '@angular/common'
import { FileUpload } from 'src/app/models/fileupload';
@Component({
  selector: 'app-mytasks',
  templateUrl: './mytasks.component.html',
  styleUrls: ['./mytasks.component.scss']
})
export class MytasksComponent implements OnInit {

  Tasks: any;
  Feedbacks:Array<any>
  isExisting:boolean = false;
  url = '';
    // ProfilePictureUpload
  currentPPUpload: FileUpload;
  selectedPPFiles: FileList;
  //CV
  selectedTFiles: FileList;
  currentCVUpload: FileUpload;

  constructor(private traineeService: TraineeService, public dialog: MatDialog,private location: Location) {}

  ngOnInit() {
      this.refresh();
      this.getFeedbacks()
  }

refresh(){
  this.traineeService.getTasks().subscribe((res) => {
    this.Tasks = res;
  });
}

  CompleteTask(Tid,taskType): void {
    let dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '500px',
      height: '300px',
      data: {
        id: Tid,
        taskType:taskType
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.refresh()
    });
  }

  getFeedbacks(){
    this.traineeService.getFeedbacks().subscribe((res) => {
      this.Feedbacks = res;
      if(this.Feedbacks.length != 0){
        this.isExisting = true;
      }
    });
  }

  goBack(): void {
    this.location.back();
  } 
  selectFile2(event) {
    this.selectedTFiles = event.target.files;
    }
    uploads() {
      const filePP = this.selectedPPFiles.item(0);
      this.currentPPUpload = new FileUpload(filePP);
      this.selectedPPFiles = undefined;
      //CV
        const file = this.selectedTFiles.item(0);
        this.selectedTFiles = undefined;
        this.currentCVUpload = new FileUpload(file);
        return
      }
  }
