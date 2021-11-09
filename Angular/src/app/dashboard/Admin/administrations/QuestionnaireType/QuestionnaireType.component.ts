import { Component, OnInit } from '@angular/core';
import { PromptComponent } from '../../../../shared/utils/modals/prompt/prompt.component';
import { TypeService } from '../../services/type.service';
import { PackageService} from '../QuestionnaireType/Package.service';
import { SimpleModalService } from 'ngx-simple-modal';
import Swal from 'sweetalert2';
import { Location } from '@angular/common'
@Component({
  selector: 'app-QuestionnaireType',
  templateUrl: './QuestionnaireType.component.html',
  styleUrls: ['./QuestionnaireType.component.scss']
})
export class QuestionnaireTypeComponent implements OnInit {

  public query: any = '';
  PackageList = [];
  PriceList = [];
  isClosed = false;
  showBranch:boolean
  Packages:Array<any> = [];

  constructor(
    private typeService: PackageService,
    private SimpleModalService: SimpleModalService, 
    private packageservice: PackageService,
    private location: Location
    ) {}


  ngOnInit() {
      this.getPackages();
  }

  getPackages() {
    this.packageservice.ViewPackageWithPrice().subscribe((packages) => {
      this.Packages = packages;
    });
}


  AddPackage() {

    this.SimpleModalService.addModal(PromptComponent, {
      title: 'Package',
      question: 'Add Your Package: ',
        message: ''
      })
      .subscribe((message) => {
        // We get modal result
          console.log(message);
          let pack = {Name:message, Description:message, Quantity:message}
          this.typeService.AddPackage(pack).subscribe(response=>{
            this.getPackages()

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
          this.typeService.UpdatePackage(pack,Id).subscribe(response=>{
            this.getPackages();
            this.typeService.success('questionnaire')
            
          }
          ,error => {throw new Error('Client Not Added '); console.log(error)})
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
        this.typeService.Removepackage(id).subscribe(res=>{
          console.log(res);
          this.getPackages();
      })
      }
    }
    )}

    goBack(): void {
      this.location.back();
    }
}

