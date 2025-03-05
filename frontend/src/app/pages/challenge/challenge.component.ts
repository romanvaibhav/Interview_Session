import { Component } from '@angular/core';
import { AuthService } from '../../cors/service/auth.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { Clipboard } from '@angular/cdk/clipboard';
import { CHALLENGE_URL, MY_FORM } from '../../constant/constant';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-challenge',
  imports: [CommonModule,ClipboardModule,ReactiveFormsModule,FormsModule],
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
      console.log("Received Session ID:", this.candidateId);
      // Use challengeId as needed
    });
    this.getProjData();
    this.fetchChallenge();
    this.loadTimer();
    this.startTimer();
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
    navigator.clipboard.writeText(url).then(() => {
      alert('URL copied to clipboard!');
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  }


  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  sessionForm=MY_FORM;
  Score:any;
  Status:any;
  Time:any;
  createSession(){
    this.sessionForm.get("score")?.setValue(this.Score);
    this.sessionForm.get("status")?.setValue(this.Status);
    this.sessionForm.get("time_duration")?.setValue(this.Time);
    this.sessionForm.get("submit")?.setValue("true");
    console.log(this.Score,this.Status,this.Time);
    console.log(this.sessionForm.value);
    this.authService.patchSession(this.sessionForm.value,this.candidateId).subscribe({next:(value)=>{
      console.log("Got the values",value);
      // this.sessionDate=value;
      this.isModalOpen = false;
      localStorage.removeItem('timeElapsed');
      this.displayedTime = "00:00"; // Reset displayed time
      this.timeElapsed = 0;
      clearInterval(this.timerInterval);

      this.sessionForm.reset();
      // this.sessionForm.get("interviewerId")?.setValue(this.userid);

    },
    error:(err)=>{
      console.log(err);
    }
  })
  }

  isModalOpen=false;

  displayedTime:any;
  openModal() {
    console.log("Hello")
    this.isModalOpen = true;
    // this.pauseTimer();
    this.displayedTime = this.getFormattedTime();
    this.Time=this.displayedTime;
    this.getFormattedTime();
  }

  closeModal() {
    this.isModalOpen = false;
    this.startTimer();
  }

  timeElapsed: number = 0; // Store time in seconds
  timerInterval: any;
  startTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }

    this.timerInterval = setInterval(() => {
      this.timeElapsed++;
      localStorage.setItem('timeElapsed', this.timeElapsed.toString()); // Store elapsed time
    }, 1000);
  }

  loadTimer() {
    const storedTime = localStorage.getItem('timeElapsed');
    if (storedTime !== null) {
      this.timeElapsed = parseInt(storedTime, 10); // Load saved time
    }
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
    localStorage.setItem('timeElapsed', this.timeElapsed.toString()); // Save time when paused
  }

  resetTimer() {
    clearInterval(this.timerInterval);
    this.timeElapsed = 0;
    localStorage.removeItem('timeElapsed'); // Reset storage
  }

}
