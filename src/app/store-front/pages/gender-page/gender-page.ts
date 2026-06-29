import { ProductCard } from '@/products/components/product-card/product-card';
import { ProductService } from '@/products/services/product.service';
import { Component, inject } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { Pagination } from '@/shared/components/Pagination/Pagination';
import { PaginationService } from '@/shared/components/Pagination/pagination.service';

@Component({
  selector: 'app-gender-page',
  imports: [ProductCard, Pagination],
  templateUrl: './gender-page.html',
})
export class GenderPage {
  route = inject(ActivatedRoute);
  gender = toSignal(this.route.params.pipe(map(({ gender }) => gender)));
  productService = inject(ProductService);
  paginationService = inject(PaginationService);

  productsResource = rxResource({
    params: () => ({ gender: this.gender(), page: this.paginationService.currentPage() - 1 }),
    stream: ({ params }) => {
      return this.productService.getProducts({
        gender: params.gender,
        offset: params.page * 9,
      });
    },
  });
}
