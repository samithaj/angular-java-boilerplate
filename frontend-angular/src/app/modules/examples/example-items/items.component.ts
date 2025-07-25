import { Component, OnInit } from '@angular/core';
import { ItemsService } from './services/items.service';
import { CommonModule } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, APP_ID, Inject } from '@angular/core';

@Component({
  selector: 'app-items',
  imports: [CommonModule],
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css']
})
export class ItemsComponent implements OnInit {

  items: any;
  loaded: boolean;
  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    @Inject(APP_ID) private appId: string,
    private ItemsService: ItemsService
  ) {
    this.loaded = false;
  }

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers(): void {
    this.loaded = false;
    this.ItemsService.getItems('http://localhost:8080/persons')
      .subscribe(
        response => {
          // The backend returns { success: true, data: [...] }
          // Extract the array so the template receives an iterable.
          const extracted = (response as any)?.data ?? response;
          this.items = extracted;
          this.loaded = true;
          const platform = isPlatformBrowser(this.platformId) ?
            'in the browser' : 'on the server';
          console.log(`getUsers : Running ${platform} with appId=${this.appId}`);
        });
  }

  resetUsers(): void {
    this.items = null;
    this.loaded = true;
  }

}