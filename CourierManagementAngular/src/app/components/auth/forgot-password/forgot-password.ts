import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-forgot-password',
  imports: [CommonModule, FormsModule],
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
}
