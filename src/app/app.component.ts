import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [RouterOutlet ],
})
export class AppComponent {
  constructor(router: Router) {
    router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => window.scrollTo(0, 0));
  }
}
