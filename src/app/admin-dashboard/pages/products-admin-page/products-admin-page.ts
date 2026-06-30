import { ProductTable } from '@/products/components/product-table/product-table';
import { ProductService } from '@/products/services/product.service';
import { Pagination } from '@/shared/components/Pagination/Pagination';
import { PaginationService } from '@/shared/components/Pagination/pagination.service';
import { Component, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-products-admin-page',
  imports: [ProductTable, Pagination, RouterLink],
  templateUrl: './products-admin-page.html',
})
export class ProductsAdminPage {
  productsService = inject(ProductService);
  paginationService = inject(PaginationService);

  productsPerPage = signal(10);

  productsResource = rxResource({
    params: () => ({
      page: this.paginationService.currentPage() - 1,
      limit: this.productsPerPage(),
    }),
    stream: ({ params }) => {
      return this.productsService.getProducts({
        offset: params.page * params.limit,
        limit: params.limit,
      });
    },
  });
}
