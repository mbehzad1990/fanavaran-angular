import { Component, Input, OnInit } from '@angular/core';
import { ResultType } from 'src/shared/Domain/Enums/global-enums';

@Component({
  selector: 'app-result-message',
  templateUrl: './result-message.component.html',
  styleUrls: ['./result-message.component.scss']
})
export class ResultMessageComponent implements OnInit {

//#region Public field
class_name: string = '';
//#endregion

//#region Private field
//#endregion

//#region Input & Output
@Input() ResultType!: ResultType;
@Input() resultSmessageText!: string;
messageText!: string;
//#endregion

constructor() {
  console.log('ResultType_input', this.ResultType)
  console.log('messageText_input', this.resultSmessageText)
}

ngOnInit(): void {

  // console.log(this.ResultType_input);
  this.messageText = this.resultSmessageText;

  this.class_name = this.getResultType_class(this.ResultType);
}
getResultType_class(resultType: ResultType): string {
  let className: string = '';
  switch (resultType) {
    case ResultType.error:
      className = 'error';
      break;
    case ResultType.Info:
      className = 'info';
      break;
    case ResultType.Successfully:
      className = 'success';
      break;
  }
  return className;
}

}

