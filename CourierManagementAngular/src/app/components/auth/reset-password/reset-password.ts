import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reset-password',
  imports: [CommonModule, FormsModule],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css',
})
export class ResetPassword {


  token = '';
  newPassword = '';
  confirmPassword = '';

  showPassword = false;
  showConfirm = false;
  loading = false;
  success = false;
  errorMessage: string | null = null;

  constructor(
    private auth: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token') ?? '';
    if (!this.token) {
      this.errorMessage = 'Invalid or missing reset token. Please request a new link.';
    }
  }

  get mismatch(): boolean {
    return !!this.confirmPassword && this.newPassword !== this.confirmPassword;
  }

  submit(): void {
    if (this.mismatch || !this.token) return;

    this.loading = true;
    this.errorMessage = null;

    this.auth.resetPassword({ token: this.token, newPassword: this.newPassword }).subscribe({
      next: () => {
        this.loading = false;
        this.success = true;
        setTimeout(() => this.router.navigate(['/login']), 3000);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage =
          err.status === 400
            ? 'Reset link is invalid or has expired. Please request a new one.'
            : 'Something went wrong. Please try again.';
      }
    });
  }

}
