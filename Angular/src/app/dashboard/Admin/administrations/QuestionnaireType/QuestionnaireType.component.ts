import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ClientService } from '../../../Client/services/client.service';
import { PackageService } from '../QuestionnaireType/Package.service';
import { SimpleModalService } from 'ngx-simple-modal';
import { Package } from '../../../../models/Package';
import Swal from 'sweetalert2';
import { Location } from '@angular/common'
import { PromptComponent } from '../../../../shared/utils/modals/prompt/prompt.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//import { NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
//import { MyDialogModalComponent } from './modals/my-dialog-modal/my-dialog-modal.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-QuestionnaireType',
  templateUrl: './QuestionnaireType.component.html',
  styleUrls: ['./QuestionnaireType.component.scss']
})
export class QuestionnaireTypeComponent implements OnInit {

  @Input() regForm: FormGroup;
  formSubmitted: boolean = false;
    Packages : Array<Package>
    Pack:any;
    MoveToNext =  false;
    PackageID:any;
    show = 20;
    public query: any = '';
    PackageList = [];
    PriceList = [];
    isClosed = false;
    showBranch:boolean
    dialogValue: string;
    sendValue: string;
    

    constructor(
      private SimpleModalService: SimpleModalService, 
      private packageServe: PackageService,
      private location: Location      
      ) {}

  

  ngOnInit() {
    this.loadData()
  }

  /**
   * !this is required before py purchase
   * todo: we still need to use the payment method
   * @param Package_ID
   * @param index
   */

  loadData(){
    this.packageServe.getPackages().subscribe(res=>{

      this.Pack = Object.keys(res).map(index => {this.Packages = res[index];});
      console.log( this.Packages)
    })
  }


  AddPackage() {

    this.SimpleModalService.addModal(PromptComponent, {
      title: 'Package',
      question: 'Add Your Package: ',
        message: '',
      
      })
      .subscribe((message) => {
        // We get modal result
          console.log(message);
          let pack = {Name:message, Description:message, Quantity:message}
          this.packageServe.AddPackage(pack).subscribe(response=>{
            this.loadData()

          },
          error => {throw new Error('Package not added')})
      });
  }

  Maintain(Description,Id) {
    this.SimpleModalService.addModal(PromptComponent, {
      title: 'Questionnaire Type',
      question: 'Update Questionnaire Type: ',
      message: Description.toString()
    })
      .subscribe((message) => {
        // We get modal result
          console.log(message);
          let pack = {Name:message, Description:message, Quantity:message, Package_ID: Id }
          this.packageServe.UpdatePackage(pack,Id).subscribe(response=>{
            this.loadData();
            this.packageServe.success('questionnaire')
            
          }
          ,error => {throw new Error('Package Not Updated '); console.log(error)})
      });
  }

  delete(id) {
    Swal.fire({
      title: 'Are You Sure You Want To Delete This Package?',
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.isConfirmed) {
        this.packageServe.Removepackage(id).subscribe(res=>{
          console.log(res);
          this.loadData();
      })
      }
    }
    )}

    goBack(): void {
      this.location.back();
    }
}




