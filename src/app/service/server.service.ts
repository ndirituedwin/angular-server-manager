import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap, throwError } from 'rxjs';
// import { CustomResponse } from '../interface/custom.response';
import { catchError } from 'rxjs/operators';
import { Server } from './../interface/server';
import { CustomResponse } from './../interface/custom.response';
import { Status } from '../enum/Status.enum';
@Injectable({
  providedIn: 'root'
})
export class ServerService {

  private readonly apiurl=`http://localhost:8080`;
  constructor(private http:HttpClient) { }

  getservers$=<Observable<CustomResponse>>
  this.http.get<CustomResponse>(`${this.apiurl}/api/server/list`)
  .pipe(
    tap(console.log),
    catchError(this.handleError)
  );

  save$=(server:Server)=><Observable<CustomResponse>>
  this.http.post<CustomResponse>(`${this.apiurl}/api/server/save`,server)
  .pipe(
    tap(console.log),
    catchError(this.handleError)
  );
  ping$=(ipaddress:string)=><Observable<CustomResponse>>
  this.http.get<CustomResponse>(`${this.apiurl}/api/server/ping/${ipaddress}`,)
  .pipe(
    tap(console.log),
    catchError(this.handleError)
  );
  delete$=(serverid:number)=><Observable<CustomResponse>>
  this.http.delete<CustomResponse>(`${this.apiurl}/api/server/deleteserverbyid/${serverid}`)
  .pipe(
    tap(console.log),
    catchError(this.handleError)
  );
  filter$=(status:Status,response:CustomResponse)=><Observable<CustomResponse>>
  new Observable<CustomResponse>(
    subscriber=>{
      console.log(response)
      subscriber.next(
        status===Status.ALL ? {...response,message:`Servers filtered by  ${status} status`}:
        {
            ...response,
            message:response.data.servers
            .filter(server=>server.status===status).length>0 ?
             `Servers filtered by ${status===Status.SERVER_UP ? 'SERVER UP':'SERVER DOWN'} status`:`No servers of ${status}`,
            data:{servers:response.data.servers?.filter(server=>server.status===status)}
        }
      );
      subscriber.complete();
    }
  )

  handleError(error:HttpErrorResponse):Observable<never>{
    console.log(error);
    return throwError(`An error occurred: ${error.status}  ${error.message}`);
  }

  

}
