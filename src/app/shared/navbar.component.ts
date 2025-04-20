import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FavoritesService } from '../core/favorites.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar mb-5">
      <h1 class="hero">🧑‍🍳Recipe Book</h1>
      <a routerLink="/favorites" class="btn btn-outline-main">❤️ Favorites</a>
      <span *ngIf="favoritesCount() > 0"  class="favorites-badge">{{ favoritesCount() }}</span>
    </nav>
  `,
  styles: [`
    .navbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: fit-content;
      margin: 0 auto 2rem;
      gap: 2rem;
    }
    @media (max-width: 768px) {
      .navbar {
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 1rem;
      }
    }
    .hero {
      font-size: 2.5rem;
      color: #D64541;
      margin: 0;
    }
    .btn-outline-main {
      color: #D64541;
      border-color: #D64541;
      border-radius: 0.5rem;
    }
    .btn-outline-main:hover {
      background-color: #D64541;
      color: #ffffff;
    }
    .position-relative {
      position: relative;
    }
    .favorites-badge {
      position: absolute;
      top: -0.5rem;
      right: -0.75rem;
      background-color: #D64541;
      color: white;
      border-radius: 50%;
      font-size: 0.75rem;
      width: 1.5rem;
      height: 1.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      box-shadow: 0 0 0 2px white;
    }
  `]
})
export class NavbarComponent {
  private favoritesService = inject(FavoritesService);
  favoritesCount = this.favoritesService.favoritesCount;
}
