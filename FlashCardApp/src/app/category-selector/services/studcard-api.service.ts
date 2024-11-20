import { Inject, Injectable } from '@angular/core';
import { APP_SERVICE_CONFIG } from '../../AppConfig/appconfig.service';
import { Appconfig } from '../../AppConfig/appconfig.interface';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { learningCard } from '../adminpage/admin';

@Injectable({
  providedIn: 'root',
  
})
export class StudcardApiService {

  $getCards : Observable<learningCard[]>;

  constructor(@Inject(APP_SERVICE_CONFIG) private config: Appconfig,
  private http: HttpClient) { 
    this.$getCards = this.http.get<learningCard[]>(this.config.apiEndpoint+ "/cards")
  }

  deleteOneCardService(id: number) {
    return this.http.delete<learningCard[]>(`${this.config.apiEndpoint}/cards/${id}`)
  }

  createNewCardService(learningCard: learningCard) {
    return this.http.post<learningCard[]>(`${this.config.apiEndpoint}/cards/`, learningCard)
  }

  editCardService(id: string, learningCard: learningCard) {
    return this.http.put<learningCard[]>(`${this.config.apiEndpoint}/cards/${id}`, learningCard)
  }

}
