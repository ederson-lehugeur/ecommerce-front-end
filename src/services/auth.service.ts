import { CartService } from './domain/cart.service';
import { JwtHelper } from 'angular2-jwt';
import { StorageService } from './storage.service';
import { LocalUser } from './../models/local-user';
import { API_CONFIG } from './../config/api.config';
import { CredenciaisDTO } from './../models/credenciais.dto';
import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';

@Injectable()
export class AuthService {

    jwtHelper: JwtHelper = new JwtHelper();

    constructor(
        public http: HttpClient,
        public storage: StorageService,
        public cartService: CartService
    ) {}

    authenticate(creds: CredenciaisDTO) {
        return this.http.post(
            `${API_CONFIG.baseUrl}/login`,
            creds,
            {
                observe: 'response',
                responseType: 'text'
            });
    }

    refreshToken() {
        return this.http.post(
            `${API_CONFIG.baseUrl}/auth/refresh_token`,
            {},
            {
                observe: 'response',
                responseType: 'text'
            });
    }

    successfulLogin(authorizationValue: string) {
        let token = authorizationValue.substring(7);
        let user: LocalUser = {
            token: token,
            email: this.jwtHelper.decodeToken(token).sub
        };
        this.storage.setlocalUser(user);
        this.cartService.createOrClearCart();
    }

    logout() {
        this.storage.setlocalUser(null);
    }
}