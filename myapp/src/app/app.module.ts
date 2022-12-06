import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormInputComponent } from './components/form-input/form-input.component';
import { SaveListButtonComponent } from './components/save-list-button/save-list-button.component';
import { FormNameInputComponent } from './components/form-name-input/form-name-input.component';
import { FormDescriptionInputComponent } from './components/form-description-input/form-description-input.component';
import { FormTrackInputComponent } from './components/form-track-input/form-track-input.component';
import { FormFlagInputComponent } from './components/form-flag-input/form-flag-input.component';

@NgModule({
  declarations: [
    AppComponent,
    FormInputComponent,
    SaveListButtonComponent,
    FormNameInputComponent,
    FormDescriptionInputComponent,
    FormTrackInputComponent,
    FormFlagInputComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
