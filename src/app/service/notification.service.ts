import { Injectable } from '@angular/core';
import { NotifierService } from 'angular-notifier';
@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private readonly notifier: NotifierService;

  constructor(notifierService: NotifierService) {
    this.notifier = notifierService;
  }
  onDefault(messagestring):void{
 this.notifier.notify(Type.DEFAULT,messagestring);
  }
  onInfo(messagestring):void{
 this.notifier.notify(Type.INFO,messagestring);
  }
  onSuccess(messagestring):void{
    this.notifier.notify(Type.SUCCESS,messagestring);
     }
     onWarning(messagestring):void{
      this.notifier.notify(Type.WARNING,messagestring);
       }
       onError(messagestring):void{
        this.notifier.notify(Type.ERROR,messagestring);
         }



}
enum Type{
  DEFAULT='default',INFO='info',SUCCESS='success',WARNING='warning',ERROR='error'
}
