import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class BackendApiService {

  constructor(private http: HttpClient) { }

  getData() {
    const url = 'http://localhost:8080/getData';
    return this.http
      // .post(url, JSON.stringify(data), { headers: _headers })
      .get(url)
      .toPromise()
      .then(response => {
        return response;
      })
      .catch(this.handleError);
  }

  takeSeat(seatId) {
    const url = 'http://localhost:8080/takeSeat';
    return this.http
      // .post(url, JSON.stringify(data), { headers: _headers })
      .get(url, { params: { 'seatId': seatId } })
      .toPromise()
      .then(response => {
        return response;
      })
      .catch(this.handleError);
  }

  save(data: any) {
    const url = 'http://localhost:8080/save';
    return this.http
      .post(url, JSON.stringify(data))
      // .get(url)
      .toPromise()
      .then(response => {
        return response;
      })
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
