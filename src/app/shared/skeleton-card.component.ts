import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skeleton-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card skeleton-card h-100">
      <div class="skeleton-img shimmer"></div>
      <div class="card-body text-center">
        <div class="skeleton-title shimmer"></div>
        <div class="skeleton-btn shimmer mt-3"></div>
      </div>
    </div>
  `,
  styles: [`
    .skeleton-card {
      border: none;
      border-radius: 1rem;
      box-shadow: 0 6px 18px rgba(0,0,0,0.1);
      max-width: 18rem;
    }
    .skeleton-img {
      height: 200px;
      background-color: #e0e0e0;
      border-top-left-radius: 1rem;
      border-top-right-radius: 1rem;
    }
    .skeleton-title {
      height: 20px;
      width: 70%;
      margin: 0 auto;
      background-color: #e0e0e0;
      border-radius: 10px;
    }
    .skeleton-btn {
      height: 30px;
      width: 50%;
      margin: 0 auto;
      background-color: #e0e0e0;
      border-radius: 5px;
    }
    .shimmer {
      position: relative;
      overflow: hidden;
    }
    .shimmer::after {
      content: '';
      position: absolute;
      top: 0;
      left: -150%;
      width: 100%;
      height: 100%;
      background: linear-gradient(to right, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%);
      animation: shimmer 1.5s infinite;
    }
    @keyframes shimmer {
      100% {
        left: 150%;
      }
    }
  `]
})
export class SkeletonCardComponent {}
