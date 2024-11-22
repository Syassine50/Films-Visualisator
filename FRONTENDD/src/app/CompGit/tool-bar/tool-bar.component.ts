import { Component, OnInit } from '@angular/core';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-tool-bar',
  templateUrl: './tool-bar.component.html',
  styleUrls: ['./tool-bar.component.scss']
})
export class ToolBarComponent implements OnInit {

  routes: string[];
  pageTitle = 'Home';

  constructor(private router: Router) {
    this.routes = this.router.config.map((route: Route) => route?.path || 'Home');
  }

  ngOnInit(): void {
    console.log(this.routes);
  }

  changeRoute(route: string): void {
    this.pageTitle = route;
    const pathToGo = route === 'Home' ? '/' : route;
    this.router.navigate([pathToGo]);
  }
}
