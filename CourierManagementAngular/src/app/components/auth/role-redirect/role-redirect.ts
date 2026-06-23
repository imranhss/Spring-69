import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../../services/storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-role-redirect',
  imports: [],
  templateUrl: './role-redirect.html',
  styleUrl: './role-redirect.css',
})
export class RoleRedirect implements OnInit{

  constructor(private storage: StorageService, private router: Router) { }

  ngOnInit(): void {
    const role = this.storage.getRole();
    const map: Record<string, string> = {
      ADMIN:    '/admin',
      AGENT:    '/agent',
      CUSTOMER: '/customer',
      RIDER:    '/rider',
    };
    this.router.navigate([map[role ?? ''] ?? '/login']);
  }




}
