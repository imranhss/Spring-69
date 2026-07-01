import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { StorageService } from '../../../../services/storage.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './sidebar.html',  
  styleUrl: './sidebar.css',
})
export class Sidebar implements OnInit {

  userRole: string | null = null;
 
  constructor(
    private storage: StorageService,
    private auth: AuthService,
    private cdr: ChangeDetectorRef,
  ) { }
 
  ngOnInit(): void {
    this.userRole = this.storage.getRole();
  }
 
  logout(): void {
    this.auth.logout();
  }

  

}
