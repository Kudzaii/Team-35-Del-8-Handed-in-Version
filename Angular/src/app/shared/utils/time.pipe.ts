import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'time'
})
export class TimePipe implements PipeTransform {

  transform(time: any): any {
    let times = time.split(':');
    let dateTime = new Date();
    dateTime.setHours(parseInt(times[0]));
    dateTime.setMinutes(parseInt(times[1]));
    dateTime.setSeconds(parseInt(times[2]))
    return dateTime
  }

}
