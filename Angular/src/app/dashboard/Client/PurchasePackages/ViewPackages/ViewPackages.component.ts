import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ClientService } from '../../../Client/services/client.service';
import { Package } from '../../../../models/Package';
import { MatStepper } from '@angular/material/stepper';

@Component({
  selector: 'app-ViewPackages',
  templateUrl: './ViewPackages.component.html',
  styleUrls: ['./ViewPackages.component.scss']
})
export class ViewPackagesComponent implements OnInit {

  @Input() regForm: FormGroup;
  formSubmitted: boolean = false;
    Packages : Array<Package>
    Pack:any;
    MoveToNext =  false;
    PackageID:any;
    show = 6;
   constructor(private clientServe:ClientService) { }

  ngOnInit() {
    this.loadData()
  }

  /**
   * !this is required before py purchase
   * todo: we still need to use the payment method
   * @param Package_ID
   * @param index
   */

  ChoosePackage(Package_ID, index){

    this.Packages[index].isChosen = true;
    this.MoveToNext = this.Packages[index].isChosen;
    this.PackageID =  Package_ID
    this.regForm.patchValue({
      ChoosePackageDetails:{
      PackageID : Package_ID,
      Client_ID : this.clientServe.ClientID
      }
    })
    this.loadData();
  }
  loadData(){
    this.clientServe.getPackages().subscribe(res=>{

      this.Pack = Object.keys(res).map(index => {this.Packages = res[index];});
      console.log( this.Packages)
    })
  }
  step2Submitted() {

    if(this.MoveToNext)
    {
      this.regForm.get('ChoosePackageDetails').get('PackageID').markAsTouched();
      this.regForm.get('ChoosePackageDetails').get('PackageID').updateValueAndValidity();
      this.regForm.get('ChoosePackageDetails').get('Client_ID').markAsTouched();
      this.regForm.get('ChoosePackageDetails').get('Client_ID').updateValueAndValidity();
    }
    else{
      alert("Please Choose A Package Before You Move To Purchase")
    }

  }
  increaseShow() {
    this.show += 10;
  }

}
