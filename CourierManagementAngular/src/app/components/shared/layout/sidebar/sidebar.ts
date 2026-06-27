import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { StorageService } from '../../../../services/storage.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, FormsModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar implements OnInit {

  userRole!: string | null;

  constructor(
    private storage: StorageService,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {

    if (this.storage.getRole()) {
      this.userRole = this.storage.getRole();
    }

    console.log(this.userRole);
  }


}
