import { Injectable } from '@angular/core';
import { LoginResponse } from '../models/auth.model';
import { CryptoUtil } from '../utils/crypto.util';


const KEYS = {
  TOKEN: 'cm_token',
  USER: 'cm_user',
};

@Injectable({
  providedIn: 'root',
})
export class StorageService {

  // ── Write ────────────────────────────────────────────

  saveSession(data: LoginResponse): void {
    localStorage.setItem(
      KEYS.TOKEN,
      CryptoUtil.encrypt(data.token)
    );
    localStorage.setItem(
      KEYS.USER,
      CryptoUtil.encrypt(JSON.stringify(data))
    );
  }


  // ── Read ─────────────────────────────────────────────

  getToken(): string | null {
    const raw = localStorage.getItem(KEYS.TOKEN);
    return raw ? CryptoUtil.decrypt(raw) : null;
  }

  getUser(): LoginResponse | null {
    const raw = localStorage.getItem(KEYS.USER);
    if (!raw) return null;
    const json = CryptoUtil.decrypt(raw);
    try {
      return json ? JSON.parse(json) : null;
    } catch {
      return null;
    }
  }

  getRole(): string | null {
    return this.getUser()?.role ?? null;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }


 // ── Clear ─────────────────────────────────────────────

  clearSession(): void {
    localStorage.removeItem(KEYS.TOKEN);
    localStorage.removeItem(KEYS.USER);
  }







}
