import { Component, input, output, signal, computed, inject, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

export interface SearchConfig {
  searchTypes: { value: string; label: string }[];
  placeholder?: string;
  showTypeSelector?: boolean;
}

export interface SearchCriteria {
  searchTerm: string;
  searchType?: string;
  filters?: Record<string, any>;
}

@Component({
  selector: 'app-search',
  template: `
    <form [formGroup]="searchForm" class="search-container">
      @if (config().showTypeSelector && config().searchTypes.length > 1) {
        <mat-form-field appearance="outline" class="search-type">
          <mat-label>Search Type</mat-label>
          <mat-select formControlName="searchType">
            @for (type of config().searchTypes; track type.value) {
              <mat-option [value]="type.value">{{ type.label }}</mat-option>
            }
          </mat-select>
        </mat-form-field>
      }
      
      <mat-form-field appearance="outline" class="search-input">
        <mat-label>{{ config().placeholder || 'Search...' }}</mat-label>
        <input matInput formControlName="searchTerm" type="text" (keyup.enter)="performSearch()">
        @if (searchTerm()) {
          <button matSuffix mat-icon-button 
                  (click)="clearSearch()" 
                  type="button"
                  aria-label="Clear search">
            <mat-icon>clear</mat-icon>
          </button>
        }
      </mat-form-field>
      
      <button mat-raised-button color="primary" 
              (click)="performSearch()" 
              type="button"
              class="search-button">
        <mat-icon>search</mat-icon>
        Search
      </button>
      
      @if (hasFilters()) {
        <button mat-icon-button 
                type="button"
                (click)="toggleFilters()"
                [class.active]="showFilters()"
                aria-label="Toggle advanced filters">
          <mat-icon>tune</mat-icon>
        </button>
      }
    </form>
    
    @if (showFilters() && hasFilters()) {
      <div class="filters-container">
        <ng-content select="[slot=filters]"></ng-content>
      </div>
    }
  `,
  styles: [`
    .search-container {
      display: flex;
      gap: 1rem;
      align-items: flex-start;
      margin-bottom: 1rem;
    }
    
    .search-type {
      min-width: 150px;
    }
    
    .search-input {
      flex: 1;
      min-width: 300px;
    }
    
    .search-button {
      height: 56px;
      margin-top: 0;
    }
    
    .filters-container {
      background: #f5f5f5;
      padding: 1rem;
      border-radius: 4px;
      margin-bottom: 1rem;
    }
    
    button.active {
      background-color: rgba(0, 0, 0, 0.04);
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule
  ]
})
export class SearchComponent implements OnInit {
  private fb = inject(FormBuilder);
  
  // Inputs
  config = input.required<SearchConfig>();
  initialValue = input<SearchCriteria>();
  debounceMs = input(300);
  
  // Outputs  
  search = output<SearchCriteria>();
  clear = output<void>();
  
  // State
  showFilters = signal(false);
  
  // Form
  searchForm!: FormGroup;
  
  // Computed signals
  searchTerm = computed(() => this.searchForm?.get('searchTerm')?.value || '');
  hasFilters = computed(() => {
    const configValue = this.config();
    return configValue?.searchTypes?.some(type => type.value === 'advanced') || false;
  });
  
  ngOnInit(): void {
    // Initialize form
    const configValue = this.config();
    this.searchForm = this.fb.group({
      searchTerm: [''],
      searchType: [configValue.searchTypes[0]?.value || 'general']
    });
    
    // Set initial values if provided
    const initial = this.initialValue();
    if (initial) {
      this.searchForm.patchValue({
        searchTerm: initial.searchTerm,
        searchType: initial.searchType || configValue.searchTypes[0]?.value
      });
    }
    
    // Subscribe to form changes with debouncing
    this.searchForm.valueChanges.pipe(
      debounceTime(this.debounceMs()),
      distinctUntilChanged(),
      takeUntilDestroyed()
    ).subscribe(value => {
      if (value.searchTerm?.trim() || this.showFilters()) {
        this.search.emit({
          searchTerm: value.searchTerm?.trim() || '',
          searchType: value.searchType,
          filters: this.showFilters() ? this.getFilters() : undefined
        });
      }
    });
  }
  
  clearSearch(): void {
    const configValue = this.config();
    this.searchForm.patchValue({
      searchTerm: '',
      searchType: configValue.searchTypes[0]?.value || 'general'
    });
    this.showFilters.set(false);
    this.clear.emit();
  }
  
  toggleFilters(): void {
    this.showFilters.update(show => !show);
  }
  
  performSearch(): void {
    const value = this.searchForm.value;
    this.search.emit({
      searchTerm: value.searchTerm?.trim() || '',
      searchType: value.searchType,
      filters: this.showFilters() ? this.getFilters() : undefined
    });
  }
  
  private getFilters(): Record<string, any> {
    // This method can be overridden by child components or 
    // extended to collect filter values from projected content
    return {};
  }
} 