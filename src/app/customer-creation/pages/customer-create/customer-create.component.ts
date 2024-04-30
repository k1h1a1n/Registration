
import { Component, OnInit, Optional, TemplateRef, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CustomerCreateService } from '../../services/customer-create.service';
import { NgTemplateOutlet } from '@angular/common';
import { Observable, of } from 'rxjs';
import { CreateLogin, CustomerData } from '../../model/customer-create';
import { SharedService } from 'src/app/shared/services/shared.service';

@Component({
  selector: 'app-customer-create',
  templateUrl: './customer-create.component.html',
  styleUrls: ['./customer-create.component.scss']
})
export class CustomerCreateComponent implements OnInit {
  isButtonDisabled : boolean = false;
  form: FormGroup;
  alertController: { action: boolean, message: string , success : boolean } = { action: false, message: '' , success : false };
  private dialog = inject(MatDialog);
  remainingTime: number = 5;
  timer: any;
  otpSend: string = 'Get OTP';
  isLoading: boolean = false;
  otpSent: boolean = false;
  pinCodeOutput$ : Observable<any>;
  divisionData$ : Observable<any>;
  branchData$ : Observable<any>;
  registrationEnbled : boolean = false;
  private ss =  inject(SharedService)

  constructor(fb: FormBuilder, @Optional() private dialogRef: MatDialogRef<any> , private verificationService : CustomerCreateService) {
    this.form = fb.group({
      verOTP: [null, [Validators.required]],
      cusMobile: [null, [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      firstName : [null, [Validators.required]],
      middleName : [null],
      lastName : [null],
      companyName : [null],
      pinCode : [null , [Validators.required , Validators.pattern('^[0-9]{6}$')]],
      branch : [null , [Validators.required]],
      division : [null , [Validators.required]],
      city : [null],
      state : [null],
      add1 : [null , [Validators.required]],
      add2 : [null],
      add3 : [null],
      mobile: [null, [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      email: ['', [Validators.required, Validators.email, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$')]],
      gender : ['M'],
      dob : [null],
      serviceProvider : [null]
    });
    this.form.get('firstName').valueChanges.subscribe(() => this.updateCompanyName());
    this.form.get('middleName').valueChanges.subscribe(() => this.updateCompanyName());
    this.form.get('lastName').valueChanges.subscribe(() => this.updateCompanyName());
  }

  ngOnInit(): void {}

  updateCompanyName(): void {
    const firstName = this.form.get('firstName').value || '';
    const middleName = this.form.get('middleName').value || '';
    const lastName = this.form.get('lastName').value || '';

    const companyName = `${firstName} ${middleName} ${lastName}`.trim();
    this.form.get('companyName').setValue(companyName);
  }

  // getOtp(dialogTemplate?: TemplateRef<NgTemplateOutlet>) {
  //   if (this.form.get('cusMobile')?.status !== 'INVALID') {
  //     const input = { "Mobile": this.form.get('cusMobile')?.value };
  //     this.isLoading = true;
  //     this.verificationService.getOtp(input).subscribe(
  //       {
  //         next: (res) => {
  //           if (res.type === 'success') {
  //             this.alertController = { action: false, message: `OTP successfully sent to this mobile ${input.Mobile} number.` }
  //             const dialogRef = this.OpenDialog(dialogTemplate, {
  //               disableClose: true,
  //             });
  //           } else {
  //             this.alertController = { action: false, message: `Something went wrong` }
  //             const dialogRef = this.OpenDialog(dialogTemplate, {
  //               disableClose: true,
  //             });
  //             this.isButtonDisabled = false; // Move this line inside the else block
  //           }
  //         },
  //         error: () => { this.isLoading = false;},
  //         complete: () => { 
  //           this.isLoading = false;
  //           this.isButtonDisabled = true;
  //           this.timerFunction();
  //           this.isButtonDisabled = false;
  //         },
  //       }
  //     );
  //   }
  // }  

  onPinCodeEntry(){
    if(this.form.get('pinCode')?.status !== 'INVALID'){
      const input = {"Partid" : "4444444" , "Pincode" : this.form.get('pinCode')?.value};
      this.verificationService.getCityDivBranch(input).subscribe((res)=>{
        const resData = JSON.parse(res.message);
      this.pinCodeOutput$ = of(resData?.DivBranch);
      const uniqueDiv = resData?.DivBranch.reduce((acc, curr) => {
        const found = acc.find(item => item.DiviName === curr.DiviName);
        if (!found) {
            acc.push(curr);
        }
        return acc;
      }, []);
      this.divisionData$ = of(uniqueDiv);
      this.form.patchValue({
        city : resData?.CityState[0].CityName,
        state : resData?.CityState[0].State
        })
      })
    }

  }
  onDivChange(value : any) {
    this.pinCodeOutput$.subscribe((res)=> {
     const branchData = res.filter((x) => {
      return x.DiviName === value
     });
     console.log(branchData)
     this.branchData$ = of(branchData);
    });
  }
  getOtp(dialogTemplate?: TemplateRef<NgTemplateOutlet>) {
    if (this.form.get('cusMobile')?.status !== 'INVALID') {
      const input = { "Mobile": this.form.get('cusMobile')?.value };
      this.isLoading = true;
      this.verificationService.getOtp(input).subscribe(
        {
          next: (res) => {
            if (res.type === 'success') {
              this.alertController = { action: false, message: `OTP successfully sent to this mobile ${input.Mobile} number.` , success : true }
              const dialogRef = this.OpenDialog(dialogTemplate, {
                disableClose: true,
              });
              this.otpSent = true; // Set otpSent to true after OTP is sent
            } else {
              this.alertController = { action: false, message: `Something went wrong` , success : false }
              const dialogRef = this.OpenDialog(dialogTemplate, {
                disableClose: true,
              });
            }
          },
          error: () => { 
            this.isLoading = false;
            this.isButtonDisabled = false; // Reset isButtonDisabled on error
          },
          complete: () => {
            this.isLoading = false; // Hide loading spinner
            // No need to set isButtonDisabled to true and then immediately to false
            this.timerFunction();
          },
        }
      );
    }
  }
  
  timerFunction(){
    this.timer = setInterval(() => {
      this.remainingTime--;
      if (this.remainingTime == 0) {
        clearInterval(this.timer);
        this.isButtonDisabled = false;
        this.remainingTime = 5;
      }
    }, 1000);
    this.otpSend = 'Resend OTP';
  }

  verifyOtp(dialogTemplate?: TemplateRef<NgTemplateOutlet>){
    if(this.form.get('verOTP')?.status !== 'INVALID'){
      const input = {"Mobile" : this.form.get('cusMobile')?.value, "OTP" : this.form.get('verOTP')?.value}
      this.verificationService.verifyOtp(input).subscribe((res)=> {
        const data = JSON.parse(res?.message);
        if(res?.code === 0){  
          if(data.Status === "1"){
            this.registrationEnbled = true ; 
            this.alertController = { action: false, message: data.Message , success : true};
            const dialogRef = this.OpenDialog(dialogTemplate, {
              disableClose: true,
            });
          } else{
            this.alertController = { action: false, message: data.Message , success : false};
            const dialogRef = this.OpenDialog(dialogTemplate, {
              disableClose: true,
            });
          }
        }else{
          this.alertController = { action: false, message: 'Something went wrong' , success : false};
          const dialogRef = this.OpenDialog(dialogTemplate, {
            disableClose: true,
          });
        }
      })
    }
  }

  OpenDialog(template: any, config?: any): MatDialogRef<any> {
    return this.dialog.open(template, config);
  }
  handleOK() {
    this.dialog.closeAll();
  }
  handleConfirm(isConfirmed: boolean): void {
    // Close the dialog with the result
    this.dialogRef.close(isConfirmed);
  }
  handleCancel() {
    this.dialog.closeAll();
  }
  onSavePosp(dialogTemplate?: TemplateRef<NgTemplateOutlet>){
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const input : CustomerData = {
      FirstName: this.form.get('firstName')?.value,
      MiddleName: this.form.get('middleName')?.value,
      LastName: this.form.get('lastName')?.value,
      CompName: this.form.get('companyName')?.value,
      Pincode: String(this.form.get('pinCode')?.value),
      City: this.form.get('city')?.value,
      Add1: this.form.get('add1')?.value,
      Add2: this.form.get('add2')?.value,
      Add3: this.form.get('add3')?.value,
      Mobile1: String(this.form.get('mobile')?.value),
      EmailId1: this.form.get('email')?.value,
      Branch: this.form.get('branch')?.value,
      Division: this.form.get('division')?.value,
      DOB: this.ss.formatDate(this.form.get('dob')?.value),
      CustType: '2',
      Gender: this.form.get('gender')?.value,
      STDCode: '',
      LandLine: '',
      EmailId2: '',
      MarrDate: '',
      DOCode: '',
      hSerProvID: this.form.get('serviceProvider')?.value,
      POSPCode: ''
    }
    this.verificationService.savePosp(input).subscribe((res)=>{
      if(res){
        const data = JSON.parse(res.message);

        if(res?.code === 0){
          if(data?.Status === "1"){
            const displayMessage = `Your generated customer Id is ${data?.Custid} for mobile number ${input.Mobile1}`;
            this.alertController = { action: false, message: displayMessage , success : true};
            const dialogRef = this.OpenDialog(dialogTemplate, {
              disableClose: true,
            });
          }else{
            this.alertController = { action: false, message: data?.Message , success : false};
            const dialogRef = this.OpenDialog(dialogTemplate, {
              disableClose: true,
            });
          }
        }else{
          this.alertController = { action: false, message: 'Something went wrong' , success : false};
          const dialogRef = this.OpenDialog(dialogTemplate, {
            disableClose: true,
          });
        }
      }
    });
  }

  createLogin(custId : string , partId : string , dialogTemplate){
    const input : CreateLogin = {
      CustID: custId,
      PartID: partId,
      ProcType: '3' //hard coded
    }
    this.verificationService.craeteLogin(input).subscribe((res)=> {
      if(res?.status){

      }else{
        this.alertController = { action: false, message: 'Something went wrong' , success : false};
          const dialogRef = this.OpenDialog(dialogTemplate, {
            disableClose: true,
          });
      }
    })
  }
}
