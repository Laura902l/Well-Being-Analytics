import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, map } from 'rxjs';

export interface AuthResponse {
  token: string;
  role: 'user' | 'admin';
  username: string;
  userId: string;
}


@Injectable({ providedIn: 'root' })
export class AuthService {

  private _isAuthenticated = signal(false);
  private _role = signal<'user' | 'admin' | null>(null);
  private _username = signal<string | null>(null);
  private _userId = signal<string | null>(null);

  readonly isAuthenticated = this._isAuthenticated.asReadonly();
  readonly role = this._role.asReadonly();
  readonly username = this._username.asReadonly();
  readonly userId = this._userId.asReadonly();

  private API = 'http://localhost:3000/api/auth';

  constructor(private http: HttpClient) { }

  login(username: string, password: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.API}/login`, { username, password })
      .pipe(
        tap(res => {
          localStorage.setItem('token', res.token);
          localStorage.setItem('role', res.role);
          localStorage.setItem('username', res.username);
          localStorage.setItem('userId', res.userId);

          this._isAuthenticated.set(true);
          this._role.set(res.role);
          this._username.set(res.username);
          this._userId.set(res.userId);
        })
      );
  }

  register(username: string, fullname: string, password: string) {
    return this.http.post(`${this.API}/register`, {
      username,
      fullname,
      password
    });
  }

  checkUsernameExists(username: string): Observable<boolean> {
    return this.http
      .get<{ exists: boolean }>(`${this.API}/check-username/${username}`)
      .pipe(map(res => res.exists));
  }


  restoreSession(): void {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role') as 'user' | 'admin' | null;
    const username = localStorage.getItem('username');
    const userId = localStorage.getItem('userId');

    if (token && role && username && userId) {
      this._isAuthenticated.set(true);
      this._role.set(role);
      this._username.set(username);
      this._userId.set(userId);
    }
  }

  logout(): void {
    localStorage.clear();
    this._isAuthenticated.set(false);
    this._role.set(null);
    this._username.set(null);
    this._userId.set(null);
  }
}
