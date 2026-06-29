import { ProductCard } from '@/products/components/product-card/product-card';
import { ProductService } from '@/products/services/product.service';
import { Component, inject } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { Pagination } from '@/shared/components/Pagination/Pagination';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { PaginationService } from '@/shared/components/Pagination/pagination.service';

@Component({
  selector: 'app-home-page',
  imports: [ProductCard, Pagination],
  templateUrl: './home-page.html',
})
export class HomePage {
  productService = inject(ProductService);
  paginationService = inject(PaginationService)
  
  

  productsResource = rxResource({
    params: () => ({ page: this.paginationService.currentPage() - 1 }),
    stream: ({ params }) => {
      return this.productService.getProducts({
        offset: params.page * 9,
      });
    },
  });
}
