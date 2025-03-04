import { Component } from '@angular/core';
import { AuthService } from '../../cors/service/auth.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { Clipboard } from '@angular/cdk/clipboard';
import { CHALLENGE_URL, MY_FORM } from '../../constant/constant';
import { ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-challenge',
  imports: [CommonModule,ClipboardModule,ReactiveFormsModule],
  providers:[Clipboard],
  templateUrl: './challenge.component.html',
  styleUrl: './challenge.component.css'
})
export class ChallengeComponent {
  projectData:any;
  candidateId:any;
  isSidebarOpen:any=false;
  ProjectId:any;
  challengeDetail:any;
  challengeUrl=CHALLENGE_URL
  constructor(private authService:AuthService, private route:ActivatedRoute, private clipboard: Clipboard,){}
  ngOnInit():void{
    this.route.queryParamMap.subscribe(params => {
      this.candidateId = params.get('id');
      console.log("Received Candidate ID:", this.candidateId);
      // Use challengeId as needed
    });
    this.getProjData();
    this.fetchChallenge();
    this.startTimer();
  }
  submitSession(){
  }


  sessionForm=MY_FORM;
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
    navigator.clipboard.writeText(url).then(() => {
      alert('URL copied to clipboard!');
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  }


  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  createSession(){
    console.log(this.sessionForm.value);
  }
  isModalOpen=false;
  openModal() {
    console.log("Hello")
    this.isModalOpen = true;
    this.pauseTimer();
  }
  closeModal() {
    this.isModalOpen = false;
  }
  timeElapsed: number = 0; // Store time in seconds
  timerInterval: any;
  startTimer() {
    this.timerInterval = setInterval(() => {
      this.timeElapsed++; // Increase time by 1 second
    }, 1000);
  }

  getFormattedTime(): string {
    const minutes = Math.floor(this.timeElapsed / 60);
    const seconds = this.timeElapsed % 60;
    return `${this.padZero(minutes)}:${this.padZero(seconds)}`;
  }

  padZero(value: number): string {
    return value < 10 ? `0${value}` : `${value}`;
  }
  pauseTimer() {
    clearInterval(this.timerInterval);
  }

}
