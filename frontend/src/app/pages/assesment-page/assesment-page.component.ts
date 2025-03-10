import { Component } from '@angular/core';
import { DomSanitizer,SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../cors/service/auth.service';
import { io } from 'socket.io-client';

@Component({
  selector: 'app-assesment-page',
  imports: [],
  templateUrl: './assesment-page.component.html',
  styleUrl: './assesment-page.component.css'
})
export class AssesmentPageComponent {
  // public safeUrl!: SafeResourceUrl;


  constructor(private sanitizer: DomSanitizer,private route:ActivatedRoute, private athService:AuthService, private router:Router){}
  projectId:any;
  project:any
  safeUrl:any;
  private socket: any;

  ngOnInit() {
    debugger
    this.projectId = this.route.snapshot.queryParams['id'];
    this.project = this.route.snapshot.queryParams['id'];

    console.log("ID from query params:", this.projectId);
    debugger
    // this.getProjectById();
    if(this.project){
      this.getProjectById();
    }

    this.getChallengeById();
    debugger
    this.socket = io('http://localhost:8001'); // Connect to the backend server
    this.socket.on('codeUpdate', (data: string) => {
      this.updateIframeCode(data);
    });
  }

  updateIframeCode(data: string) {
    // Find the iframe element
    const iframe = document.querySelector('iframe');
    if (iframe) {
      // Send code to the iframe using postMessage (can be used with an embedded editor)
      iframe.contentWindow?.postMessage(data, '*');
    }
  }

  sendCodeUpdate(code: string) {
    this.socket.emit('codeUpdate', code); // Emit the code change to the server
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

  getChallengeById(){
    this.athService.getOneChallengeById(this.projectId).subscribe({next:(value:any)=>{
      debugger
      console.log("printing the value",value);
      debugger
      if(value.challenges[0].status=="Completed"){
        // this.router.navigateByUrl("");
        this.router.navigate(['/assesment/expired'], { replaceUrl: true });
      }
      else{
        const Url=value.challenges[0].url;
        console.log(Url);
        this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(Url);
        this.pathcChallengeById();

      }

    },
    error:(err)=>{
      console.log(err);
    }
  })
  };

  score:any;
  pathcChallengeById(){
    const status="In-Progress";
    this.athService.patchChallenge(this.projectId,status,this.score).subscribe({next:(value:any)=>{
      console.log("Succesfully patched the values",value);
    },
    error:(err)=>{
      console.log("Got the error at the patching challenge values",err);
    }
  })
  }

  submitBtn(){
    const status="Completed";
    this.athService.patchChallenge(this.projectId,status,this.score).subscribe({next:(value:any)=>{
      console.log("Succesfully patched the values",value);
      // this.router.navigateByUrl("");
      this.router.navigate(['assesment/completed'], { replaceUrl: true });

    },
    error:(err)=>{
      console.log("Got the error at the patching challenge values",err);
    }
  })
  }
}
