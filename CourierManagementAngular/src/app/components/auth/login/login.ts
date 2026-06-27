import { Component } from '@angular/core';
import { LoginRequest } from '../../../models/auth.model';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Navbar } from '../../shared/layout/navbar/navbar';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule, Navbar],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  dto: LoginRequest = { email: '', password: '' };

  showPassword = false;
  loading = false;
  errorMessage: string | null = null;

  constructor(private auth: AuthService, private router: Router) { }


  login(): void {
    this.loading = true;
    this.errorMessage = null;

    this.auth.login(this.dto).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage =
          err.status === 401
            ? 'Invalid email or password.'
            : err.status === 403
              ? 'Your account is not verified or has been disabled.'
              : 'Something went wrong. Please try again.';
      }
    });
  }



}
