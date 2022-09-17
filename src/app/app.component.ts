import { Component } from '@angular/core';
import { FacadService } from 'src/shared/Service/_Core/facad.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Fanavaran-client';
  constructor(private _facadService:FacadService){

  }
}
