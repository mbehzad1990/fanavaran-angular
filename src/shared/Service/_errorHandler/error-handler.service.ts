import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ResultAction } from 'src/shared/Domain/Enums/global-enums';

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerService {
  constructor() { }
  getErrorText(resultAction: ResultAction): string {
    let resultText = '';
    switch (resultAction) {
      case ResultAction.Success:
        resultText = 'عملیات با موفقیت انجام شد';
        break;
      case ResultAction.ClientAlreadyExist:
        resultText = 'مشتری با این مشخصات تکراری است';
        break;
      case ResultAction.ExceptionFaild:
        resultText = 'خطا در سرور رخ داده است';
        break;
      case ResultAction.UserNotExist:
        resultText = 'کاربری با این مشخصات وجود ندارد';
        break;
      case ResultAction.UserPasswordNotCorrect:
        resultText = 'نام کاربری یا رمز عبور نادرست است';
        break;
      case ResultAction.SaveUserTokenFailed:
        resultText = 'در فرآیند احراز هویت خطا رخ داده است';
        break;
      case ResultAction.ServiceException:
        resultText = 'خطا در ارتباط سرویس با سرور';
        break;
      case ResultAction.UserAlreadyExist:
        resultText = 'این کاربر قبلا اضافه شده است';
        break;
      case ResultAction.StockOperationHasRefId:
        resultText = 'برای این حواله فاکتور برگشت وجود دارد';
        break;
      case ResultAction.UnitAlreadyExist:
        resultText = 'این واحد قبلا اضافه شده است';
        break;
      case ResultAction.GoodManuelIdAlreadyUse:
        resultText ='این کد دستی کالا قبلا استفاده شده است';
        break;
      case ResultAction.GoodAlreadyUseInRemittance:
        resultText ='این کالا در فاکتوری ثبت شده است';
        break;
      case ResultAction.PersonAlreadyUseInRemittance:
        resultText ='این شخص در فاکتوری ثبت شده است';
        break;
      case ResultAction.StockAlreadyUseInRemittance:
        resultText ='این انبار در فاکتوری ثبت شده است';
        break;
      case ResultAction.ManuelIdAlreadyUseInRemittance
      :
        resultText ='این کد حواله قبلا استفاده شده است';
        break;
      default:
        resultText = 'UnHandled';

    }
    return resultText;
  }
  conrollerErrorHandler(
    control: string,
    error: string,
    formController: FormGroup
  ) {
    return formController.controls[control].hasError(error);
  }
}
