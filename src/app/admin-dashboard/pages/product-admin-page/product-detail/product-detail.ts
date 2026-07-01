import { Product } from '@/products/interfaces/product.interface';
import { Component, input } from '@angular/core';
import { ProductCarousel } from "@/products/components/product-carousel/product-carousel";

@Component({
  selector: 'product-detail',
  imports: [ProductCarousel],
  templateUrl: './product-detail.html',
})
export class ProductDetail {
  product = input.required<Product>()

  sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

}
