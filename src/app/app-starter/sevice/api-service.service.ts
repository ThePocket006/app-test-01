import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ISubPlan } from '../vo/formDataVo';

export interface IData {
  subscription_plans: ISubPlan[]
}

@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {
  constructor(
    private http: HttpClient
  ) { }

  /**NOTE - requete http de recuperation des donnees de souscription */
  public getPlan() {
    return this.http.get<IData>('/assets/data.json');
  }
}
