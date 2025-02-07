import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
    selector: 'app-tabs',
    templateUrl: 'tabs.page.html',
    styleUrls: ['tabs.page.scss'],
    standalone: false
})
export class TabsPage implements OnInit, OnDestroy{
  private $unsubscribe: Subscription;
  constructor(private router: Router) {
    this.observeUrlChanges = this.observeUrlChanges.bind(this);
  }
  ngOnInit(): void {
    this.$unsubscribe = this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(this.observeUrlChanges);
  }
  observeUrlChanges(event: NavigationEnd) {

  
  }
  ngOnDestroy() {
    this.$unsubscribe.unsubscribe();
  }
}
