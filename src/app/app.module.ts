import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { OnePlanetComponent } from './component/one-planet/one-planet.component';
import { AllPlanetsComponent } from './component/all-planets/all-planets.component';

@NgModule({
  declarations: [
    AppComponent,
    OnePlanetComponent,
    AllPlanetsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AppModule { }
