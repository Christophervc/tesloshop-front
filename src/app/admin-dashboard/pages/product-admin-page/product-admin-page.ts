import { Component, effect, inject, signal } from '@angular/core';
import { ProductDetail } from './product-detail/product-detail';
import { ProductService } from '@/products/services/product.service';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';

@Component({
  selector: 'app-product-admin-page',
  imports: [ProductDetail],
  templateUrl: './product-admin-page.html',
})
export class ProductAdminPage {
  activatedRoute = inject(ActivatedRoute);
  productsService = inject(ProductService);
  router = inject(Router);

  productId = toSignal(this.activatedRoute.params.pipe(map((params) => params['id'])));

  productsResource = rxResource({
    params: () => ({ id: this.productId() }),
    stream: ({ params }) => this.productsService.getProductByIdSlug(params.id),
  });

  redirectEffect = effect(()=> {
    if(this.productsResource.error()) {
      this.router.navigate(['/admin/products'])
    }
  })
}
