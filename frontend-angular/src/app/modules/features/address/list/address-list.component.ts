import { Component, OnInit, signal, computed, inject, ChangeDetectionStrategy } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AddressService, AddressSearchFilters } from '../services/address.service';
import { Address, AddressPage } from '../services/address.model';
import { AddressDialogComponent } from '../dialog/address-dialog.component';
import { SearchComponent, SearchConfig, SearchCriteria } from '../../../../shared/components/search/search.component';
import { NavigationComponent, PageInfo, NavigationEvent } from '../../../../shared/components/navigation/navigation.component';

@Component({
  selector: 'app-address-list',
  template: `
    <div class="address-list-container">
      <div class="header">
        <h2>Address Management</h2>
        <button mat-raised-button color="primary" (click)="openDialog()">
          <mat-icon>add</mat-icon>
          New Address
        </button>
      </div>

      <app-search 
        [config]="searchConfig()" 
        (search)="onSearch($event)"
        (clear)="onClearSearch()">
        <div slot="filters" class="address-filters">
          <!-- Advanced filters can be added here -->
        </div>
      </app-search>

      @if (loading()) {
        <div class="loading-container">
          <mat-spinner></mat-spinner>
        </div>
      } @else {
        <div class="table-container">
          <table mat-table [dataSource]="addresses()" class="address-table">
            <ng-container matColumnDef="street">
              <th mat-header-cell *matHeaderCellDef>Street</th>
              <td mat-cell *matCellDef="let address">{{ address.street }}</td>
            </ng-container>

            <ng-container matColumnDef="city">
              <th mat-header-cell *matHeaderCellDef>City</th>
              <td mat-cell *matCellDef="let address">{{ address.city }}</td>
            </ng-container>

            <ng-container matColumnDef="state">
              <th mat-header-cell *matHeaderCellDef>State</th>
              <td mat-cell *matCellDef="let address">{{ address.state || '-' }}</td>
            </ng-container>

            <ng-container matColumnDef="postalCode">
              <th mat-header-cell *matHeaderCellDef>Postal Code</th>
              <td mat-cell *matCellDef="let address">{{ address.postalCode }}</td>
            </ng-container>

            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let address">
                <button mat-icon-button (click)="openDialog(address)" aria-label="Edit address">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-icon-button (click)="deleteAddress(address)" aria-label="Delete address">
                  <mat-icon>delete</mat-icon>
                </button>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>

          @if (addresses().length === 0 && !loading()) {
            <div class="no-data">
              <mat-icon>location_off</mat-icon>
              <p>No addresses found</p>
              @if (hasActiveSearch()) {
                <button mat-button (click)="onClearSearch()">Clear Search</button>
              }
            </div>
          }
        </div>

        <app-navigation 
          [pageInfo]="pageInfo()" 
          (navigate)="onNavigate($event)">
        </app-navigation>
      }
    </div>
  `,
  styles: [`
    .address-list-container {
      padding: 1rem;
    }
    
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }
    
    .header h2 {
      margin: 0;
      color: rgba(0, 0, 0, 0.87);
    }
    
    .loading-container {
      display: flex;
      justify-content: center;
      padding: 2rem;
    }
    
    .table-container {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }
    
    .address-table {
      width: 100%;
    }
    
    .no-data {
      text-align: center;
      padding: 3rem;
      color: rgba(0, 0, 0, 0.6);
    }
    
    .no-data mat-icon {
      font-size: 3rem;
      width: 3rem;
      height: 3rem;
      margin-bottom: 1rem;
    }
    
    .address-filters {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    AddressDialogComponent,
    SearchComponent,
    NavigationComponent
  ]
})
export class AddressListComponent implements OnInit {
  private service = inject(AddressService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  
  // State signals
  loading = signal(false);
  addressPage = signal<AddressPage | null>(null);
  currentFilters = signal<AddressSearchFilters>({ page: 0, size: 10, sort: 'id,asc' });
  
  // Computed signals
  addresses = computed(() => this.addressPage()?.content || []);
  pageInfo = computed((): PageInfo => {
    const page = this.addressPage();
    return {
      page: page?.number || 0,
      size: page?.size || 10,
      totalElements: page?.totalElements || 0,
      totalPages: page?.totalPages || 0,
      first: page?.first || true,
      last: page?.last || true
    };
  });
  
  hasActiveSearch = computed(() => {
    const filters = this.currentFilters();
    return !!(filters.q || filters.city || filters.state || filters.postalCode);
  });
  
  // Table configuration
  displayedColumns = ['street', 'city', 'state', 'postalCode', 'actions'];
  
  searchConfig = computed((): SearchConfig => ({
    searchTypes: [
      { value: 'general', label: 'All Fields' },
      { value: 'city', label: 'City' },
      { value: 'state', label: 'State' },
      { value: 'postalCode', label: 'Postal Code' }
    ],
    placeholder: 'Search addresses...',
    showTypeSelector: true
  }));

  ngOnInit(): void {
    this.loadAddresses();
  }

  private loadAddresses(): void {
    this.loading.set(true);
    const filters = this.currentFilters();
    
    const request$ = this.hasActiveSearch() 
      ? this.service.search(filters)
      : this.service.getAll(filters);
    
    request$.subscribe({
      next: (page) => {
        this.addressPage.set(page);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.snackBar.open('Failed to load addresses', 'Close', { duration: 3000 });
      }
    });
  }

  onSearch(criteria: SearchCriteria): void {
    const filters: AddressSearchFilters = {
      ...this.currentFilters(),
      page: 0, // Reset to first page on new search
      q: criteria.searchTerm || undefined,
      city: undefined,
      state: undefined,
      postalCode: undefined
    };
    
    // Set specific field filters based on search type
    if (criteria.searchType === 'city') {
      filters.city = criteria.searchTerm;
      filters.q = undefined;
    } else if (criteria.searchType === 'state') {
      filters.state = criteria.searchTerm;
      filters.q = undefined;
    } else if (criteria.searchType === 'postalCode') {
      filters.postalCode = criteria.searchTerm;
      filters.q = undefined;
    }
    
    this.currentFilters.set(filters);
    this.loadAddresses();
  }

  onClearSearch(): void {
    this.currentFilters.set({
      page: 0,
      size: this.currentFilters().size,
      sort: this.currentFilters().sort
    });
    this.loadAddresses();
  }

  onNavigate(event: NavigationEvent): void {
    this.currentFilters.update(filters => ({
      ...filters,
      page: event.page,
      size: event.size
    }));
    this.loadAddresses();
  }

  openDialog(address?: Address): void {
    const dialogRef = this.dialog.open(AddressDialogComponent, {
      data: address,
      width: '500px'
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadAddresses();
        this.snackBar.open('Address saved successfully', 'Close', { duration: 3000 });
      }
    });
  }

  deleteAddress(address: Address): void {
    if (confirm(`Are you sure you want to delete the address at ${address.street}?`)) {
      this.service.delete(address.id!).subscribe({
        next: () => {
          this.loadAddresses();
          this.snackBar.open('Address deleted successfully', 'Close', { duration: 3000 });
        },
        error: () => {
          this.snackBar.open('Failed to delete address', 'Close', { duration: 3000 });
        }
      });
    }
  }
}
