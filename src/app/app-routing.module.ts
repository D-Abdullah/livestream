import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MeetingComponent } from './meeting/meeting.component';
import { WhiteboardComponent } from './join-meet/whiteboard/whiteboard.component';
import { JoinMeetComponent } from './join-meet/join-meet.component';

const routes: Routes = [
  { path: "home", redirectTo: "", pathMatch: "full" }, 
  {path: "",component:HomeComponent},
  {path: "meeting",component:MeetingComponent},
  {path: "white-board",component:WhiteboardComponent},
  {path: "meeting/:meetId",component:JoinMeetComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
