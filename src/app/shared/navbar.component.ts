import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar mb-5">
      <h1 class="hero">🍽️ Recipe Book</h1>
      <a routerLink="/favorites" class="btn btn-outline-main">❤️ Favorites</a>
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
  `]
})
export class NavbarComponent {}
