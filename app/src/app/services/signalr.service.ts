import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SignalrService {
  connection: any;

  encodingMessageBack: BehaviorSubject<string>;
  constructor() {
    this.connection = null;
    this.encodingMessageBack = new BehaviorSubject<string>("");

  }
  public initiateSignalrConnection(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.connection = new signalR.HubConnectionBuilder()
        .withUrl(environment.signalrHubUrl)
        .build();

      this.setSignalrClientMethods();

      this.connection
        .start()
        .then(() => {
          console.log(`SignalR connection success! connectionId: ${this.connection.connectionId}`);
          resolve();
        })
        .catch((error: any) => {
          console.log(`SignalR connection error: ${error}`);
          reject();
        });
    });
  }

  private setSignalrClientMethods(): void {
    this.connection.on('DisplayMessage', (message: string) => {
      this.encodingMessageBack.next(message);
    });
  }
}