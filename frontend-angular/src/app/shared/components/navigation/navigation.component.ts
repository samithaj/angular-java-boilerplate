import { Component, input, output, computed, ChangeDetectionStrategy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

export interface PageInfo {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

export interface NavigationEvent {
  page: number;
  size: number;
}

@Component({
  selector: 'app-navigation',
  template: `
    <div class="navigation-container">
      <div class="navigation-info">
        <span>
          Showing {{ startItem() }} to {{ endItem() }} of {{ pageInfo().totalElements }} entries
        </span>
      </div>
      
      <div class="navigation-controls">
        <div class="page-size-selector">
          <mat-form-field appearance="outline" class="size-field">
            <mat-label>Items per page</mat-label>
            <mat-select [value]="pageInfo().size" 
                       (selectionChange)="onPageSizeChange($event.value)">
              @for (size of pageSizes(); track size) {
                <mat-option [value]="size">{{ size }}</mat-option>
              }
            </mat-select>
          </mat-form-field>
        </div>
        
        <div class="page-buttons">
          <button mat-icon-button 
                  [disabled]="pageInfo().first"
                  (click)="goToFirst()"
                  aria-label="First page">
            <mat-icon>first_page</mat-icon>
          </button>
          
          <button mat-icon-button 
                  [disabled]="pageInfo().first"
                  (click)="goToPrevious()"
                  aria-label="Previous page">
            <mat-icon>chevron_left</mat-icon>
          </button>
          
          <div class="page-info">
            <mat-form-field appearance="outline" class="page-field">
              <mat-label>Page</mat-label>
              <input matInput 
                     type="number" 
                     [value]="currentPageDisplay()"
                     (keydown.enter)="onPageInput($event)"
                     (blur)="onPageInput($event)"
                     [min]="1"
                     [max]="pageInfo().totalPages"
                     aria-label="Current page">
            </mat-form-field>
            <span class="page-total">of {{ pageInfo().totalPages }}</span>
          </div>
          
          <button mat-icon-button 
                  [disabled]="pageInfo().last"
                  (click)="goToNext()"
                  aria-label="Next page">
            <mat-icon>chevron_right</mat-icon>
          </button>
          
          <button mat-icon-button 
                  [disabled]="pageInfo().last"
                  (click)="goToLast()"
                  aria-label="Last page">
            <mat-icon>last_page</mat-icon>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .navigation-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 0;
      flex-wrap: wrap;
      gap: 1rem;
    }
    
    .navigation-info {
      color: rgba(0, 0, 0, 0.6);
      font-size: 0.875rem;
    }
    
    .navigation-controls {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    
    .page-size-selector .size-field {
      width: 120px;
    }
    
    .page-buttons {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    
    .page-info {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    
    .page-field {
      width: 80px;
    }
    
    .page-total {
      color: rgba(0, 0, 0, 0.6);
      font-size: 0.875rem;
      white-space: nowrap;
    }
    
    @media (max-width: 768px) {
      .navigation-container {
        flex-direction: column;
        align-items: stretch;
      }
      
      .navigation-controls {
        justify-content: center;
        flex-wrap: wrap;
      }
      
      .navigation-info {
        text-align: center;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    FormsModule
  ]
})
export class NavigationComponent {
  // Inputs
  pageInfo = input.required<PageInfo>();
  pageSizes = input<number[]>([10, 20, 50, 100]);
  
  // Outputs
  navigate = output<NavigationEvent>();
  
  // Computed values
  currentPageDisplay = computed(() => this.pageInfo().page + 1);
  startItem = computed(() => 
    this.pageInfo().totalElements === 0 ? 0 : this.pageInfo().page * this.pageInfo().size + 1
  );
  endItem = computed(() => 
    Math.min((this.pageInfo().page + 1) * this.pageInfo().size, this.pageInfo().totalElements)
  );
  
  goToFirst(): void {
    if (!this.pageInfo().first) {
      this.navigate.emit({
        page: 0,
        size: this.pageInfo().size
      });
    }
  }
  
  goToPrevious(): void {
    if (!this.pageInfo().first) {
      this.navigate.emit({
        page: this.pageInfo().page - 1,
        size: this.pageInfo().size
      });
    }
  }
  
  goToNext(): void {
    if (!this.pageInfo().last) {
      this.navigate.emit({
        page: this.pageInfo().page + 1,
        size: this.pageInfo().size
      });
    }
  }
  
  goToLast(): void {
    if (!this.pageInfo().last) {
      this.navigate.emit({
        page: this.pageInfo().totalPages - 1,
        size: this.pageInfo().size
      });
    }
  }
  
  onPageSizeChange(newSize: number): void {
    // Calculate new page to maintain roughly the same position
    const currentItem = this.pageInfo().page * this.pageInfo().size;
    const newPage = Math.floor(currentItem / newSize);
    
    this.navigate.emit({
      page: newPage,
      size: newSize
    });
  }
  
  onPageInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const pageNumber = parseInt(input.value, 10);
    
    if (pageNumber >= 1 && pageNumber <= this.pageInfo().totalPages) {
      this.navigate.emit({
        page: pageNumber - 1, // Convert to 0-based
        size: this.pageInfo().size
      });
    } else {
      // Reset to current page if invalid
      input.value = this.currentPageDisplay().toString();
    }
  }
} 