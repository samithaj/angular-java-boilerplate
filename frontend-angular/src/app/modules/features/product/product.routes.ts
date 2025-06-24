import { Routes } from '@angular/router';
import { ProductListComponent } from './list/product-list.component';
import { ProductCategoryListComponent } from './category/list/product-category-list.component';
import { ProductSubCategoryListComponent } from './subcategory/list/product-subcategory-list.component';

export const routes: Routes = [
  { path: '', component: ProductListComponent },
  { path: 'categories', component: ProductCategoryListComponent },
  { path: 'subcategories', component: ProductSubCategoryListComponent }
];
