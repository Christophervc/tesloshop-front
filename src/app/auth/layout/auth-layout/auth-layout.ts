import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-auth-layout',
  imports: [RouterOutlet],
  templateUrl: './auth-layout.html',
})
export class AuthLayout {
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  private currentUrl = signal(this.router.url.toLowerCase());

  constructor() {
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => this.currentUrl.set(event.urlAfterRedirects.toLowerCase()));

    this.destroyRef.onDestroy(() => {
      this.currentUrl.set('');
    });
  }

  pageTitle = computed(() =>
    this.currentUrl().includes('register') ? 'Regístrese' : 'Bienvenido de vuelta',
  );

  pageSubtitle = computed(() =>
    this.currentUrl().includes('register')
      ? 'Crea tu cuenta y comienza a comprar con Teslo Shop.'
      : 'Ingresa con tu correo y contraseña para continuar.',
  );

  showImage = computed(() => this.currentUrl().includes('auth'));
}
