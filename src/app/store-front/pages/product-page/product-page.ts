import { ProductService } from '@/products/services/product.service';
import { Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { ProductCarousel } from "@/products/components/product-carousel/product-carousel";

@Component({
  selector: 'app-product-page',
  imports: [ProductCarousel],
  templateUrl: './product-page.html',
})
export class ProductPage {
  activatedRoute = inject(ActivatedRoute);

  productService = inject(ProductService);

  productIdSlug: string = this.activatedRoute.snapshot.params['idSlug'];

  productsResource = rxResource({
    params: () => ({ idSlug: this.productIdSlug }),
    stream: ({ params }) => {
      return this.productService.getProductByIdSlug(params.idSlug);
    },
  });
}
