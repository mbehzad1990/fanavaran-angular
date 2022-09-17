import { Injectable } from '@angular/core';
import * as moment from 'jalali-moment';


@Injectable({
  providedIn: 'root'
})
export class UitiliyFuncService {

  constructor() { }

  getShamsiString(strDate: string): string {
    if (strDate != '') {
      let MomentDate = moment(new Date(strDate), 'YYYY/MM/DD').locale('fa').format('YYYY/MM/DD');
      return MomentDate;
    }
    return '';
  }
  convertMiladiDateToString(date: Date): string {
    const _deteMoment = moment(date).format("jYYYY/jMM/jDD");
    const _date = new Date(moment.from(_deteMoment, 'fa', 'YYYY/MM/DD').locale('en').format('YYYY/MM/DD'));
    return _date.toLocaleDateString();
  }
  getMiladiDatefromStringDate(date: string | null): Date {
    const s = moment(date!).format("jYYYY/jMM/jDD");
    const str = new Date(moment.from(s, 'fa', 'YYYY/MM/DD').locale('en').format('YYYY/MM/DD'));
    return str;
  }
  getMiladiString(date: Date | null): string {
    return new Date(moment.from(date!.toString(), 'fa', 'YYYY/MM/DD').locale('en').format('YYYY/MM/DD')).toLocaleDateString();
  }
  convertShamsiStringDateToMiladiStringDate(shamsiDate: string) {
    const _dateSelected = new Date(moment.from(shamsiDate, 'fa', 'YYYY/MM/DD').locale('en').format('YYYY/MM/DD'));
    return this.convertMiladiDateToString(_dateSelected);
  }
  controlDateInRemittance(date: string): boolean {
    const _dateNow = moment(new Date()).format("jYYYY/jMM/jDD");
    const _inputMonth = parseInt(date.substring(5,7));
    const _currentMonth = parseInt(_dateNow.substring(5,7));
    if((_inputMonth<_currentMonth) || (_inputMonth>_currentMonth )){
      return false;
    }
    return true;
  }
}
