import { Component } from '@angular/core';
import { DomSanitizer,SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../cors/service/auth.service';

@Component({
  selector: 'app-assesment-page',
  imports: [],
  templateUrl: './assesment-page.component.html',
  styleUrl: './assesment-page.component.css'
})
export class AssesmentPageComponent {
  // public safeUrl!: SafeResourceUrl;


  constructor(private sanitizer: DomSanitizer,private route:ActivatedRoute, private athService:AuthService){}
  projectId:any;
  safeUrl:any;

  ngOnInit() {
    this.projectId = this.route.snapshot.queryParams['id'];
    console.log("ID from query params:", this.projectId);
    this.getProjectById();
  }


  getProjectById(){
    this.athService.getProjectById(this.projectId).subscribe({next:(value:any)=>{
      console.log("Got the value",value);
      const Url=value.StackBlitzUrl;
      this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(Url);
    },
    error:(err)=>{
      console.log(err);
    }
  })
  }


}
