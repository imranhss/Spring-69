import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AgentResponseModel } from '../../../../models/agent.model';
import { KEYS, StorageService } from '../../../../services/storage.service';
import { AgentService } from '../../../../services/agent.service';
import { LoginResponse } from '../../../../models/auth.model';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-agent-profile-component',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './agent-profile-component.html',
  styleUrl: './agent-profile-component.css',
})
export class AgentProfileComponent {



  user: LoginResponse | null = null;
  agent: AgentResponseModel | null = null;
 
  // ── Editable form fields ──────────────────────────────────────
  form = {
    name: '',
    email: '',
    phone: '',
    designation: '',
  };
 
  // ── Photo ──────────────────────────────────────────────────────
  imageBase = 'http://localhost:8085/images/agent/';
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
 
  // ── Password (optional change) ────────────────────────────────
  showPasswordSection = false;
  newPassword = '';
  confirmPassword = '';
  showPassword = false;
  showConfirmPassword = false;
 
  // ── UI state ───────────────────────────────────────────────────
  loading = true;
  saving = false;
  submitted = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;
 
  constructor(
    private agentService: AgentService,
    private storage: StorageService,
    private cdr: ChangeDetectorRef
  ) { }
 
  ngOnInit(): void {
    this.user = this.storage.getUser();
    this.loadAgent();
  }
 
  loadAgent(): void {
    this.loading = true;
 
    const cached = this.storage.getData<AgentResponseModel>(KEYS.AGENT);
    if (cached) {
      this.applyAgent(cached);
      this.loading = false;
    }
 
    // Always refresh from server too, in case it changed elsewhere
    if (this.user?.userId) {
      this.agentService.findByUserId(this.user.userId).subscribe({
        next: (res) => {
          this.applyAgent(res);
          this.storage.saveData(KEYS.AGENT, res);
          this.loading = false;
          this.cdr.markForCheck();
        },
        error: () => { this.loading = false; }
      });
    }
  }
 
  private applyAgent(agent: AgentResponseModel): void {
    this.agent = agent;
    this.form.name        = agent.name        ?? this.user?.name  ?? '';
    this.form.email       = agent.email        ?? this.user?.email ?? '';
    this.form.phone       = agent.phone        ?? this.user?.phone ?? '';
    this.form.designation = agent.designation  ?? '';
  }
 
  // ── Photo handling ────────────────────────────────────────────
 
  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (!file) return;
 
    this.selectedFile = file;
    const reader = new FileReader();
    reader.onload = () => { this.imagePreview = reader.result; };
    reader.readAsDataURL(file);
  }
 
  removeSelectedFile(fileInput: HTMLInputElement): void {
    this.selectedFile = null;
    this.imagePreview = null;
    fileInput.value = '';
  }
 
  get currentPhotoUrl(): string | null {
    if (this.imagePreview) return this.imagePreview as string;
    if (this.agent?.image) return this.imageBase + this.agent.image;
    return null;
  }
 
  // ── Password ──────────────────────────────────────────────────
 
  get passwordsMismatch(): boolean {
    return !!this.newPassword && this.newPassword !== this.confirmPassword;
  }
 
  // ── Save ──────────────────────────────────────────────────────
 
  saveProfile(): void {
    this.submitted = true;
    this.errorMessage = null;
    this.successMessage = null;
 
    if (!this.form.name || !this.form.email || !this.form.phone) {
      return;
    }
 
    if (this.showPasswordSection && this.newPassword && this.passwordsMismatch) {
      return;
    }
 
    if (!this.agent?.id) {
      this.errorMessage = 'Agent profile not loaded yet. Please try again.';
      return;
    }
 
    this.saving = true;
 
    const payload: any = {
      name: this.form.name,
      email: this.form.email,
      phone: this.form.phone,
      designation: this.form.designation,
    };
 
    // Only include password if the agent chose to change it
    if (this.showPasswordSection && this.newPassword) {
      payload.password = this.newPassword;
    }
 
    this.agentService.updateAgent(this.agent.id, payload, this.selectedFile ?? undefined).subscribe({
      next: (updated) => {
        this.agent = updated;
        this.storage.saveData(KEYS.AGENT, updated);
 
        // Keep the login session's display name/email/phone in sync
        if (this.user) {
          this.user.name  = updated.name  ?? this.user.name;
          this.user.email = updated.email ?? this.user.email;
          this.user.phone = updated.phone ?? this.user.phone;
          this.storage.saveData(KEYS.USER, this.user); // re-encrypt updated session copy
        }
 
        this.selectedFile = null;
        this.imagePreview = null;
        this.newPassword = '';
        this.confirmPassword = '';
        this.showPasswordSection = false;
        this.submitted = false;
 
        this.successMessage = 'Profile updated successfully.';
        this.saving = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.errorMessage = err?.error?.message ?? 'Failed to update profile. Please try again.';
        this.saving = false;
      }
    });
  }



}
