import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '@environments/environment';
import {  EncodingRequest, EncodingResponse } from '@app/models';
import { map } from 'rxjs/operators';
@Injectable({ providedIn: 'root' })
export class EncodingService 
{
    
    constructor(private http: HttpClient) 
    { 

    }

    encodingInvokeRequest(requestValue:string, encodingSessionId:string, signalrRsessionId:string) : Observable<any>
    {
        const body = 
        {
             content: requestValue,
             sessionId: encodingSessionId,
             signalRSessionId:signalrRsessionId
        };
        return this.http
        .post<any>(`${environment.apiUrl}/encoding`, body)
        .pipe(map(r=>{
            console.log(r);
            return r;
        }));
    }

    encodingDisposeRequest(encodingSessionId:string) : Observable<any>
    {
        return this.http
        .delete<any>(`${environment.apiUrl}/encoding/${encodingSessionId}`)
        .pipe(map(r=>{
            console.log(r);
            return r;
        }));
    }
}