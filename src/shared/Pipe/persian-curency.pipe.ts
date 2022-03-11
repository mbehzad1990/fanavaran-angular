import { DecimalPipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'persianCurencyPipe'
})
export class PersianCurencyPipe implements PipeTransform {

  currencyChars = new RegExp('[\.,]', 'g'); // we're going to remove commas and dots
  constructor(private decimalPipe: DecimalPipe){

  }
  transform(value: number): unknown {
    const stringValue=value.toString();
    const numberFormat = parseInt(String(stringValue).replace(this.currencyChars, ''));
    const usd = this.decimalPipe.transform(numberFormat, '1.0', 'en-US');
    return usd;
  }

}
