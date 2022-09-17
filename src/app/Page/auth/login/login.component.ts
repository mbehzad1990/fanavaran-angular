import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { LoginDto } from 'src/shared/Domain/Dto/_User/login-dto';
import { NotificationType, ResultAction } from 'src/shared/Domain/Enums/global-enums';
import { FacadService } from 'src/shared/Service/_Core/facad.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  //#region private field
  private _unsubscribe: Subscription[] = [];
  //#endregion

  //#region public field
  hidePassword = true;
  rem: boolean = false;
  loginForm!: FormGroup;
  returnUrl!: string;
  isLoading$!: Observable<boolean>;
  //#endregion

  constructor(private fb: FormBuilder, private _coreService: FacadService,private router: Router) {
    this.isLoading$=this._coreService.auth.isLoading$;

  }

  ngOnInit(): void {
    this.formElementInit();
  }
  formElementInit() {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['',
        Validators.compose([Validators.required, Validators.minLength(8)]),
      ],
      isRemember: [false],
    });
  }
  errorHandling(control: string, error: string) {
    return this.loginForm.controls[control].hasError(error);
  }

  login(username: string, password: string, rememberMe: boolean=false) {
    const model = new LoginDto();
    model.userName = username;
    model.passWord = password;
    model.isRememberMe = rememberMe;

    const sb = this._coreService.auth.login(model).subscribe(result=>{
      if(result){
        if(result?.isSuccess && result.resultAction==ResultAction.Success){
          const actionText=this._coreService.errorHandler.getErrorText(result.resultAction);
          this._coreService.notification.showNotiffication(NotificationType.Success,actionText);
          this.router.navigate(['']);
        }else{
          const actionText=this._coreService.errorHandler.getErrorText(result.resultAction);
          this._coreService.notification.showNotiffication(NotificationType.Error,actionText);
        }
      }else{
        this._coreService.notification.showNotiffication(NotificationType.Error,"خطا در ارتباط");
      }
    });
    this._unsubscribe.push(sb);

  }

  ngOnDestroy(): void {
    this._unsubscribe.forEach((sb) => {
      sb.unsubscribe();
    });
  }
}

