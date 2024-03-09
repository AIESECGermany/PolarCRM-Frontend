import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class DseService {

    public backend = 'http://localhost:8000/utils/upload';

    constructor(
        private http: HttpClient,
        private authService: AuthService
    ) { }

    public uploadDocument(file: File) {
        console.log(this.authService.user.lc);
        console.log(this.authService.user.role);
        const formData = new FormData();
        formData.append('dseUpload', file);
        return this.http.post(this.backend, formData, { params: { lc: this.authService.user.lc } });
    }
}
