import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { StorageService } from '../../../../services/storage.service';

@Component({
  selector: 'app-sidebar',
  imports: [],
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
