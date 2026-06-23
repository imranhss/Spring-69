import { ChangeDetectorRef, Component } from '@angular/core';
import { LoginResponse } from '../../../../models/auth.model';
import { RiderResponseModel } from '../../../../models/rider.model';
import { KEYS, StorageService } from '../../../../services/storage.service';
import { AuthService } from '../../../../services/auth.service';
import { RiderService } from '../../../../services/rider.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-riderdashboard',
  imports: [CommonModule],
  templateUrl: './riderdashboard.html',
  styleUrl: './riderdashboard.css',
})
export class Riderdashboard {


   user: LoginResponse | null = null;
  userId!: number;
  rider: RiderResponseModel | null = null;
 imageUrl = 'http://localhost:8085/images/rider/';


  constructor(

    private storage: StorageService,
    private auth: AuthService,
    private riderService: RiderService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.user = this.storage.getUser();


    if (this.user?.userId) {
      this.userId = this.user?.userId;

    }
    this.loadRider();

    const rider = this.storage.getData<RiderResponseModel>(KEYS.RIDER);
    console.log(rider);
  }

  loadRider() {

    this.riderService.findByUserId(this.userId).subscribe(

      {
        next: res=>{
          this.rider = res;
          this.cdr.markForCheck();
          
          this.storage.saveData(KEYS.RIDER, res);

        },
        error: err=>{
          console.log(err);
        }
      }

    );

  }


  logout(): void { this.auth.logout();
    this.storage.removeData(KEYS.RIDER);
   }
}
