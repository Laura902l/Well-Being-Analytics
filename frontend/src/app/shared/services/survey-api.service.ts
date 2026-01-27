import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SurveyId } from './storage.service';

export interface SurveyDoc {
  _id: string;
  userId: string;
  username: string;

  surveyId: SurveyId;
  data: Record<string, number>;
  createdAt: string;
  updatedAt: string;
}

@Injectable({ providedIn: 'root' })
export class SurveyApiService {

  private API = 'http://localhost:3000/api/surveys';

  constructor(private http: HttpClient) {}
  saveSurvey(
    surveyId: SurveyId,
    data: unknown,
    userId: string
  ): Observable<void> {
    return this.http.post<void>(this.API, {
      surveyId,
      data,
      userId
    });
  }

  loadAll(userId: string): Observable<SurveyDoc[]> {
    return this.http.get<SurveyDoc[]>(`${this.API}/${userId}`);
  }

  loadAllForAdmin(): Observable<SurveyDoc[]> {
    return this.http.get<SurveyDoc[]>(`${this.API}/admin`);
  }
}
