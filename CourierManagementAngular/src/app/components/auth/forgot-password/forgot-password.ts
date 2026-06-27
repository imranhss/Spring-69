import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Navbar } from '../../shared/layout/navbar/navbar';

@Component({
  selector: 'app-forgot-password',
  imports: [CommonModule, FormsModule, Navbar],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css',
})
export class ForgotPassword {


  email = '';
  loading = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(private auth: AuthService) { }

  submit(): void {
    this.loading = true;
    this.successMessage = null;
    this.errorMessage = null;

    this.auth.forgotPassword({ email: this.email }).subscribe({
      next: () => {
        this.loading = false;
        this.successMessage = `A password reset link has been sent to ${this.email}.`;
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'No account found with that email address.';
      }
    });
  }


  scrollTo(id: string): void {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }

}
