import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { map, Observable, startWith } from 'rxjs';
import { AppState } from './interface/app-state';
import { CustomResponse } from './interface/custom.response';
import { ServerService } from './service/server.service';
import { DataState } from './enum/data.state.enum';
import { Status } from './enum/Status.enum';
import { catchError } from 'rxjs/operators';
import { of,BehaviorSubject } from 'rxjs';
import { Server } from './interface/server';
import { NgForm } from '@angular/forms';
import { NotificationService } from './service/notification.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css',
],
changeDetection:ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {


  appstate$: Observable<AppState<CustomResponse>>;
  readonly DataState = DataState;
  readonly Status = Status;
  private filterSubject = new BehaviorSubject<string>('');
  private datasubject = new BehaviorSubject<CustomResponse>(null);
  filterstatus$ = this.filterSubject.asObservable();
  private isLoading = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoading.asObservable();
  // constructor(private ServerService:ServerService,private notifier:NotificationService){
    constructor(private ServerService:ServerService){
  }
  ngOnInit(): void {
    this.appstate$=this.ServerService.getservers$
    .pipe(
      map(response=>{
        this.datasubject.next(response)
        // this.notifier.onDefault(response.message)
                return {dataState:DataState.LOADED_STATE,appData:{...response,data:{servers:response.data.servers.reverse()}}}
      }),
      startWith({dataState:DataState.LOADING_STATE}),
      catchError((error:string)=>{
        // this.notifier.onError(error)
        return of({dataState:DataState.ERROR_STATE,error})
      })
    );
  }
    pingServer(ipAddress:string): void {
      // console.log("server pinged")
      this.filterSubject.next(ipAddress);
      this.appstate$=this.ServerService.ping$(ipAddress)
        .pipe(
          map(response=>{
             const index=this.datasubject.value.data.servers.findIndex(server=>server.id===response.data.server.id);
            this.datasubject.value.data.servers[ index ]=response.data.server;
            this.filterSubject.next('');
            return {dataState:DataState.LOADED_STATE,appData:this.datasubject.value}
          }),
          startWith({dataState:DataState.LOADED_STATE,appData:this.datasubject.value}),
          catchError((error:string)=>{
            this.filterSubject.next('');
            return of({dataState:DataState.ERROR_STATE,error})
          })
        );
  }

  deleteserver(server:Server):void{
    this.appstate$=this.ServerService.delete$(server.id)
    .pipe(
      map(response=>{
       this.datasubject.next( {
          ...response,data:{servers:this.datasubject.value.data.servers.filter(s=>s.id !==server.id)}
        });
        return {dataState:DataState.LOADED_STATE,appData:this.datasubject.value}
      }),
      startWith({dataState:DataState.LOADED_STATE,appData:this.datasubject.value}),
      catchError((error:string)=>{
         return of({dataState:DataState.ERROR_STATE,error})
      })
    );
  }
  saveserver(serverform:NgForm):void{
    this.isLoading.next(true);
    this.appstate$=this.ServerService.save$(serverform.value as  Server)
      .pipe(
        map(response=>{
          this.datasubject.next(
            {...response,data:{servers:[response.data.server,...this.datasubject.value.data.servers]}}
          );
          document.getElementById('closeModal').click();
          this.isLoading.next(false);

          serverform.resetForm({status:this.Status.SERVER_DOWN})
          return{dataState:DataState.LOADED_STATE,appData:this.datasubject.value}
        }),
        startWith({dataState:DataState.LOADED_STATE,appData:this.datasubject.value}),
        catchError((error:string)=>{
          // this.filterSubject.next('');
          this.isLoading.next(false);

          return of({dataState:DataState.ERROR_STATE,error})
        })

      );
  }

  filterServers(status: Status): void {
    this.appstate$ = this.ServerService.filter$(status, this.datasubject.value)
      .pipe(
        map(response => {
          // this.notifier.onDefault(response.message);
          return { dataState: DataState.LOADED_STATE, appData: response };
        }),
        startWith({ dataState: DataState.LOADED_STATE, appData: this.datasubject.value }),
        catchError((error: string) => {
          // this.notifier.onError(error);
          return of({ dataState: DataState.ERROR_STATE, error });
        })
      );
  }
  printreport():void{
    window.print();
        return null;
    let dataType="application/vnd.ms-excel.sheet.macroEnabled.12";
    let tableselect=document.getElementById('servers')
    let tableHtml=tableselect.outerHTML.replace(/ /g,'%20')
    let downloadlink=document.createElement('a');
    document.body.appendChild(downloadlink);
    downloadlink.href='data:'+dataType+','+tableHtml;
    downloadlink.download='server-report.xls';
    downloadlink.click();
    document.body.removeChild(downloadlink);

  }


}
