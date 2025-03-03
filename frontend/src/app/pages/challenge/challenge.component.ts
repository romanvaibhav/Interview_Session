import { Component } from '@angular/core';
import { AuthService } from '../../cors/service/auth.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-challenge',
  imports: [CommonModule],
  templateUrl: './challenge.component.html',
  styleUrl: './challenge.component.css'
})
export class ChallengeComponent {
  projectData:any;
  candidateId:any;
  isSidebarOpen:any=false;
  ProjectId:any;
  challengeDetail:any;
  constructor(private authService:AuthService, private route:ActivatedRoute){}
  ngOnInit():void{
    this.route.queryParamMap.subscribe(params => {
      this.candidateId = params.get('id');
      console.log("Received Challenge ID:", this.candidateId);
      // Use challengeId as needed
    });
    this.getProjData();
    this.fetchChallenge();
  }
  submitSession(){

  }


  getProjData(){
    this.authService.getProject().subscribe({next:(value:any)=>{
      console.log("Got the EmpData",value);
      this.projectData=value;
      console.log("Here is empData",this.projectData);
    },
    error:(err:any)=>{
      console.log("Frontend error while fetching empData",err);
    }
  })
  }

  selectProject(project: any) {
    console.log("Here is project", project);
    this.isSidebarOpen = false;

    // Format the data correctly
    let challengeData = [{
      url: project.StackBlitzUrl,  // Sending the URL
      title: project.title         // Sending the Title
    }];
    // Call postChallenge with the formatted data
    this.authService.postChallenge(challengeData, project.userId, this.candidateId)
      .subscribe({
        next: (value: any) => {
          console.log("Posted the challenge Data", value);
          this.challengeDetail=value.challenges;
          console.log("challenges",this.challengeDetail);
        },
        error: (err) => {
          console.error("Error posting challenge data", err);
        }
      });
  }

  fetchChallenge(){
    console.log("Fetching");
    this.authService.getChallenge(this.candidateId).subscribe({next:(value:any)=>{
      console.log("Fetch the challenge Data",value)
      this.challengeDetail=value[0].challenges;
      console.log("Got the challenges here",this.challengeDetail);
    },
    error:(err)=>{
      console.log(err);
    }
  })

  }

  deleteChallenge(id:any){
    console.log("Deleting challenge od ID",id);
    this.authService.deleteChallenge(id,this.candidateId).subscribe({next:(value:any)=>{
      console.log("value after Deleting",value);
      this.fetchChallenge();
    },
    error:(err)=>{
      console.log(err);
    }
  })
  }

  copyToClipboard(url:any){

  }


  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

}
