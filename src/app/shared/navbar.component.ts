import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FavoritesService } from '../core/services/favorites.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar mb-5">
      <h1 class="hero">🧑‍🍳Recipe Book</h1>
      <a routerLink="/favorites" class="btn btn-outline-main">
        ❤️ Favorites
        <span *ngIf="favoritesCount() > 0" class="favorites-badge">{{ favoritesCount() }}</span>
      </a>
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
        text-align: center;
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
      position: relative; /* ✅ necessario per il badge */
    }

    .btn-outline-main:hover {
      background-color: #D64541;
      color: #ffffff;
    }

    .favorites-badge {
      position: absolute;
      top: -6px;
      right: -8px;
      background-color: #D64541;
      color: white;
      border-radius: 50%;
      font-size: 0.7rem;
      width: 1.2rem;
      height: 1.2rem;
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
