import { ChangeDetectorRef, Component } from '@angular/core';
import { LoginResponse } from '../../../../models/auth.model';
import { KEYS, StorageService } from '../../../../services/storage.service';
import { AuthService } from '../../../../services/auth.service';
import { AgentService } from '../../../../services/agent.service';
import { AgentResponseModel } from '../../../../models/agent.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-agentdashboard',
  imports: [CommonModule],
  templateUrl: './agentdashboard.html',
  styleUrl: './agentdashboard.css',
})
export class Agentdashboard {

  user: LoginResponse | null = null;

  userId!: number;
  agent: AgentResponseModel | null = null;
  imageUrl = 'http://localhost:8085/images/agent/';

  constructor(
    private storage: StorageService,
    private auth: AuthService,
    private agentService: AgentService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.user = this.storage.getUser();

    if (this.user?.userId) {
      this.userId = this.user?.userId;

    }

    this.loadCustomer();

    const agent = this.storage.getData<AgentResponseModel>(KEYS.AGENT);
    console.log(agent);

  }


  loadCustomer() {

    this.agentService.findByUserId(this.userId).subscribe(

      {
        next: res => {
          this.agent = res;
          this.cdr.markForCheck();
         
          this.storage.saveData(KEYS.AGENT, res);

        },
        error: err => {
          console.log(err);
        }
      }

    );

  }

  logout(): void {
    this.auth.logout();
     this.storage.removeData(KEYS.AGENT);
  }





  

}
