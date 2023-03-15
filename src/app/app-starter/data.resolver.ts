import { Injectable } from '@angular/core';
import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable } from 'rxjs';
import { ApiServiceService, IData } from './sevice/api-service.service';

@Injectable({
  providedIn: 'root'
})
export class DataResolver implements Resolve<IData> {
  constructor(
    private api: ApiServiceService
  ) {
    
  }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IData> {
    return this.api.getPlan();
  }
}
