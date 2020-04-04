import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AuthGuardService } from "../../authentication/services/auth-guard.service";
import { MasterAiComponent } from "./master-ai/master-ai.component";

const routes: Routes = [
  {
    path: "AI",
    children: [
      {
        path: "manage-master-AI",
        component: MasterAiComponent,
        data: { title: "RxP CMS Manager » Databases » Master AI" },
        canActivate: [AuthGuardService]
      }
      /*{
        path: "manage-master-AI",
        component: MasterAiComponent,
        data: { title: "RxP CMS Manager » Databases » Master AI" },
        canActivate: [AuthGuardService]
      }*/
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AIRoutingModule {}
