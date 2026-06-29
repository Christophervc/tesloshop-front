import { ProductCard } from '@/products/components/product-card/product-card';
import { ProductService } from '@/products/services/product.service';
import { Component, inject } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';

@Component({
  selector: 'app-gender-page',
  imports: [ProductCard],
  templateUrl: './gender-page.html',
})
export class GenderPage {
  route = inject(ActivatedRoute);
  gender = toSignal(this.route.params.pipe(map(({ gender }) => gender)));
  productService = inject(ProductService);

  productsResource = rxResource({
    params: () => ({ gender: this.gender() }),
    stream: ({ params }) => {
      return this.productService.getProducts({
        gender: params.gender,
      });
    },
  });
}
