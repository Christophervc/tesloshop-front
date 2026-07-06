import { Product } from '@/products/interfaces/product.interface';
import { Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { ProductCarousel } from '@/products/components/product-carousel/product-carousel';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormUtils } from '@/utils/form.utils';
import { FormErrorLabel } from '@/shared/components/form-error-label/form-error-label';
import { ProductService } from '@/products/services/product.service';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'product-detail',
  imports: [ProductCarousel, ReactiveFormsModule, FormErrorLabel],
  templateUrl: './product-detail.html',
})
export class ProductDetail implements OnInit {
  product = input.required<Product>();

  productService = inject(ProductService);

  router = inject(Router);

  fb = inject(FormBuilder);

  productSavedAlert = signal(false);

  tempImages = signal<string[]>([]);
  imageFileList: FileList | undefined = undefined;

  imagesToCarousel = computed(()=> {
    const currentProductImages =[ ...this.product().images, ...this.tempImages()]
    return currentProductImages;
  })

  productForm = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    slug: ['', [Validators.required, Validators.pattern(FormUtils.slugPattern)]],
    price: [0, [Validators.required, Validators.min(0)]],
    stock: [0, [Validators.required, Validators.min(0)]],
    sizes: [['']],
    images: [[]],
    tags: [''],
    gender: ['men', [Validators.required, Validators.pattern(/men|women|kid|unisex/)]],
  });

  sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  ngOnInit(): void {
    this.setFormValue(this.product());
  }

  setFormValue(formLike: Partial<Product>) {
    this.productForm.reset(this.product() as any);
    this.productForm.patchValue({ tags: formLike.tags?.join(',') });
  }

  onSizeClicked(size: string) {
    const currentSizes = this.productForm.value.sizes ?? [];

    if (currentSizes.includes(size)) {
      currentSizes.splice(currentSizes.indexOf(size), 1);
    } else {
      currentSizes.push(size);
    }
    this.productForm.patchValue({ sizes: currentSizes });
  }

  async onSubmit() {
    const isValid = this.productForm.valid;
    this.productForm.markAllAsTouched();

    if (!isValid) return;

    const formValue = this.productForm.value;

    const productLike: Partial<Product> = {
      ...(formValue as any),
      tags:
        formValue.tags
          ?.toLowerCase()
          .split(',')
          .map((tag) => tag.trim()) ?? [],
    };

    console.log({ productLike });

    if (this.product().id === 'new') {
      // create a new product
      const product = await firstValueFrom(this.productService.createProduct(productLike, this.imageFileList));

      console.log('producto creado');
      this.router.navigate(['/admin/products', product.id]);
    } else {
      await firstValueFrom(this.productService.updateProduct(this.product().id, productLike, this.imageFileList));
      console.log('producto actualizado');
    }

    this.productSavedAlert.set(true);
    setTimeout(() => this.productSavedAlert.set(false), 2000);
  }

  onFilesChanged(event: Event) {
    const filesList = (event.target as HTMLInputElement).files;
    this.imageFileList = filesList ?? undefined;

    const imageUrls = Array.from(filesList ?? []).map((file) => URL.createObjectURL(file));
    console.log({imageUrls})

    this.tempImages.set(imageUrls);
  }
}
