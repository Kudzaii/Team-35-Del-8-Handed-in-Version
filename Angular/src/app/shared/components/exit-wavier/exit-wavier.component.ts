import { Component, OnInit } from '@angular/core';
import { FileUpload } from 'src/app/models/fileupload';
import Swal from 'sweetalert2';
import { FileUploadService } from '../../services/fileUpload.service';

@Component({
  selector: 'app-exit-wavier',
  templateUrl: './exit-wavier.component.html',
  styleUrls: ['./exit-wavier.component.scss']
})
export class ExitWavierComponent implements OnInit {
  selectedFiles?: FileList;
  currentFileUpload?: FileUpload;
  percentage = 0;
  fileName =  '';
  constructor(private uploadService: FileUploadService) { }

  ngOnInit(): void {
  }

  selectFile(event: any): void {
    this.selectedFiles = event.target.files;
    this.fileName = event.target.files[0].name
  }

  upload(): void {

    Swal.fire({
      title: 'Are You Sure You Want To Upload Your Exit Waiver?',
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.isConfirmed) {
        if (this.selectedFiles) {
          const file: File | null = this.selectedFiles.item(0);
          this.selectedFiles = undefined;

          if (file) {
            this.currentFileUpload = new FileUpload(file);
            this.uploadService.pushFileToStorage(this.currentFileUpload,"Documents","Exit Wavier").subscribe(
              percentage => {
                this.percentage = Math.round(percentage ? percentage : 0);
              },
              error => {
                console.log(error);
              }
            );

          }
        }

      }
    })
  }
}
