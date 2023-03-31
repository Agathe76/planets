import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllPlanetsComponent } from './component/all-planets/all-planets.component';
import { OnePlanetComponent } from './component/one-planet/one-planet.component';

const routes: Routes = [
  {
    path: "",
    component: AllPlanetsComponent
  },
  {
    path: "one-planet",
    component: OnePlanetComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
