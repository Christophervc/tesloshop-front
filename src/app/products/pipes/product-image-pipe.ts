import { Pipe, type PipeTransform } from '@angular/core';
import { environment } from '../../../environments/environment.development';

const baseUrl = environment.baseUrl;

@Pipe({
  name: 'ProductImage',
})
export class ProductImagePipe implements PipeTransform {
  transform(value: null |string | string[]): string {

    if(value == null || value == undefined) {
      return this.getImageUrlNotFound();
    }

    if (typeof value === 'string') {
      return `${baseUrl}/files/product/${value}`;
    }

    const image = value?.at(0);

    if (!image) {
      return this.getImageUrlNotFound();
    }

    return this.getImageUrl(image);
  }

  private getImageUrl(image: string): string {
    const imageBaseUrl = `${baseUrl}/files/product`;

    return `${imageBaseUrl}/${image}`;
  }

  private getImageUrlNotFound(): string {
    return '/assets/images/no-image.jpg';
  }
}
