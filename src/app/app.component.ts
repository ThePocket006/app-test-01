import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app-test-01';

  links = [
    { title: 'Home', fragment: '' },
    { title: 'App', fragment: '/app' }
  ];

  constructor(public route: ActivatedRoute) {}
}
