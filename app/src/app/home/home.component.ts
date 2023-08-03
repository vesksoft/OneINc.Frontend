import { Component } from '@angular/core';
import { first } from 'rxjs/operators';
import * as uuid from 'uuid';
import { EncodingRequest, EncodingResponse } from '@app/models';
import { EncodingService,SignalrService } from '@app/services'
import { FormsModule } from '@angular/forms';
import { Observable, forkJoin,catchError } from 'rxjs'
import { map } from 'rxjs/operators';

@Component({ templateUrl: 'home.component.html' })
export class HomeComponent {
 
    encodingsessionId: string;
    encodingMessageBack? : string;
    encodingText = 'Hello, World!';
    loading = false;
    encodingStart = false;
    
    constructor(private encodingService:EncodingService, public signalrService: SignalrService) 
    {
        this.encodingMessageBack = '';
        this.encodingsessionId = '';
    }


    ngOnInit() 
    {
        this.signalrService.encodingMessageBack.subscribe((message: string) => {
           
            console.log(message);
            let messageArray = message.split(":");

            if (this.encodingStart)
            {
                if(messageArray[1] == this.encodingsessionId)
                {
                    this.encodingMessageBack = this.encodingMessageBack + messageArray[0];
                
                    if (messageArray[2].toLowerCase() == "true")
                    {
                        this.loading = false;
                    }
                }
            }
          });
    }

    startEncoding()
    {
        this.encodingMessageBack = '';
        console.log("start encoding process:" + this.encodingText);
        this.loading = true;
        this.encodingsessionId = uuid.v4().toString();

            this.encodingService.encodingInvokeRequest(this.encodingText, this.encodingsessionId, this.signalrService.connection.connectionId)
            .pipe(first())
            .subscribe({
                next: data=> {
                     if(data.status)
                     {
                        this.encodingStart = true;
                     } 
                },
                error: er => {
                    console.log(er);
                    this.loading = false;
                    this.encodingStart = false;
                }
            });

    }

    stopEncoding()
    {
        this.encodingText = '';
        
        this.loading = true;
        this.encodingStart = false;
        console.log("finish encoding process")

        this,this.encodingService.encodingDisposeRequest(this.encodingsessionId).pipe(first())
        .subscribe({
            next: data=> {
                this.loading = false;
                this.encodingsessionId = '';
            },
            error: er => {
                console.log(er);
                this.loading = false;
            }
        });
    }
}