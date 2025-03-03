import { Routes } from '@angular/router';
import { LoginComponent } from './modules/login/login.component';
import { Component } from '@angular/core';
import { RegistrationComponent } from './modules/registration/registration.component';
import { HomeComponent } from './pages/home/home.component';
import { ProjectsComponent } from './pages/projects/projects.component';
import { AssesmentPageComponent } from './pages/assesment-page/assesment-page.component';
import { ChallengeComponent } from './pages/challenge/challenge.component';

export const routes: Routes = [
  {
    path:"",
    component:LoginComponent
  },
  // {
  //   path:"regi",
  //   component:RegistrationComponent
  // },
  // {
  //   path:"home",
  //   component:HomeComponent
  // },
  // {
  //   path:"project",
  //   component:ProjectsComponent
  // },
  {
    path: "user",
    children: [
      {path:"home", component:HomeComponent},
      {
        path:"project",
        component:ProjectsComponent
      },
      {
        path:"challenge",
        component:ChallengeComponent
      }
    ]
  },
  {
    path: 'assesment',
    component: AssesmentPageComponent,
  },
  { path: "regi", component: RegistrationComponent },

];
