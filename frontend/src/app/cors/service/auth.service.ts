import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../env/env';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  static baseUrl=environment.API_HOST_URL;

  constructor(private httpClient:HttpClient) { }

  postRegistration(regiForm:any):Observable<object>{
    return this.httpClient.post(`${AuthService.baseUrl}/register`,regiForm);
  }

  postLogin(loginForm:any):Observable<object>{
    return this.httpClient.post(`${AuthService.baseUrl}/login`,loginForm);
  }

  postProject(projForm:any):Observable<object>{
    return this.httpClient.post(`${AuthService.baseUrl}/user/add`,projForm);
  }
  patchProject(projForm:any,projectId:string):Observable<object>{
    return this.httpClient.patch(`${AuthService.baseUrl}/user/update/${projectId}`, projForm);
  }

  getProject():Observable<object>{
    return this.httpClient.get(`${AuthService.baseUrl}/user/read`);
  }

  getProjectById(projectId:any):Observable<object>{
    console.log(projectId);
    const params = new HttpParams().set('id', projectId);
    return this.httpClient.get(`${AuthService.baseUrl}/user/proj`,{params});
  }

  deleteProjById(id:any):Observable<object>{
    return this.httpClient.delete(`${AuthService.baseUrl}/user/delete?id=${id}`);
  }




  //Session Crud
  postSession(sessionForm:any):Observable<object>{
    let filteredForm = { ...sessionForm };
    // Remove empty string values
    Object.keys(filteredForm).forEach(key => {
      if (filteredForm[key] === "" || filteredForm[key] === null) {
        delete filteredForm[key];  // Removes the key if it's empty
      }
    });
    return this.httpClient.post(`${AuthService.baseUrl}/session/add`,filteredForm);
  }

  patchSession(sessionForm:any,sessionId:string):Observable<object>{
    console.log(sessionId);
    const params = new HttpParams().set('id', sessionId);
    let filteredForm = { ...sessionForm };
    // Remove empty string values
    Object.keys(filteredForm).forEach(key => {
      if (filteredForm[key] === "" || filteredForm[key] === null) {
        delete filteredForm[key];  // Removes the key if it's empty
      }
    });
    return this.httpClient.patch(`${AuthService.baseUrl}/session/update`,filteredForm,{params});
  }

  deleteSessionById(id:any):Observable<object>{
    console.log(id);
    const params = new HttpParams().set('id', id);
    return this.httpClient.delete(`${AuthService.baseUrl}/session/delete`,{params});
  }

  getSession():Observable<object>{
    return this.httpClient.get(`${AuthService.baseUrl}/session/read`);
  }

  getSessionById(sessionId:any):Observable<object>{
    console.log(sessionId);
    const params = new HttpParams().set('id', sessionId);
    return this.httpClient.get(`${AuthService.baseUrl}/session/ses`,{params});
  }



  // Challenge Crud

  postChallenge(challenges:{url:string; title:string}[], userId: string, candidateId: string): Observable<object> {
    return this.httpClient.post(`${AuthService.baseUrl}/challenge/add`, {
      challenges,
      userId,
      candidateId,
    });
  }

  deleteChallenge(id:any,candidateId:string):Observable<object>{
    console.log(id);
    const params = new HttpParams().set('id', id).set('candidateId',candidateId);
    return this.httpClient.delete(`${AuthService.baseUrl}/challenge/delete`,{params});
  }
  getChallenge(candidateId:any):Observable<object>{
    console.log(candidateId);
    const params = new HttpParams().set('id', candidateId);
    return this.httpClient.get(`${AuthService.baseUrl}/challenge/read`,{params});
  }
  getOneChallengeById(id:any):Observable<object>{
    console.log(id);
    const params = new HttpParams().set('challengeId', id);
    return this.httpClient.get(`${AuthService.baseUrl}/challenge/readone`,{params})
  }

}


