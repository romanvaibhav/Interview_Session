import { Component } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';  // ✅ Import DatePipe
import { AuthService } from '../../cors/service/auth.service';

@Component({
  selector: 'app-hostory',
  standalone: true,
  imports: [CommonModule],
  providers: [DatePipe],  // ✅ Add DatePipe here
  templateUrl: './hostory.component.html',
  styleUrl: './hostory.component.css'
})
export class HostoryComponent {
  constructor(
    private authService: AuthService,
    private datePipe: DatePipe  // ✅ Inject DatePipe here
  ) {}

  ngOnInit(): void {
    this.getSessionData();
  }

  sessionDate: any;

  getSessionData() {
    this.authService.getSession().subscribe({
      next: (value) => {
        console.log("Got the Session Data Successfully", value);

        if (Array.isArray(value)) {
          this.sessionDate = value
            .filter((session: any) => session.submit === 'true')
            .map((session: any) => ({
              ...session,
              formattedDate: this.datePipe.transform(session.createdAt, 'shortDate')
            }));
        } else {
          console.error("Unexpected data structure:", value);
          this.sessionDate = [];
        }
      },
      error: (err) => {
        console.error("Got error while getting sessionData", err);
      }
    });
  }
}
