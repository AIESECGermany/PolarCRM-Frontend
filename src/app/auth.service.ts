import { SocialUser } from '@abacritt/angularx-social-login';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserCredentials, UserRole } from './interfaces';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public domain = 'http://localhost:8000/login/';
  public user: UserCredentials = {
    token: '',
    role: 'none',
    lc: ''
  };

  constructor( private http: HttpClient ) { }

  public authenticateUser(user: SocialUser): Promise<UserCredentials> {
    return new Promise((resolve) => {
      this.user.token = user.idToken;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const req = this.http.post<any>(
        this.domain,
        { 'token': this.user.token },
        { headers: {'Content-Type': 'application/json'} }
      );
      req.subscribe((res) => {
        this.user.role = res.userRole;
        this.user.lc = res.lc;
        resolve(this.user);
      });
    });
  }

  public reauthenticateUser(requiredRole: UserRole): boolean {
    switch(this.user.role) {
      case 'local':
        if(requiredRole === 'local') return true;
        else return false;
      case 'national':
        if(requiredRole !== 'admin') return true;
        else return false;
      case 'admin':
        return true;
      default:
        return false;
    }
  }
}
