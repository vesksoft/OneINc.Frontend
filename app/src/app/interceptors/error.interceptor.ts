import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AuthenticationService } from '@app/services';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthenticationService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            var errMessage ="";
            if ([401, 403].includes(err.status)) {
                // auto logout if 401 response returned from api
                this.authenticationService.logout();
                errMessage = " Invalid username or password. Please try again."
            }
            

            const errorResponse = (err?.error != null ? err.error.message : err.status) + errMessage;
          
            return throwError(() => errorResponse);
        }))
    }
}