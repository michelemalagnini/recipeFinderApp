import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skeleton-recipe-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="detail-container py-5">
      <div class="mb-4 text-center text-md-start">
        <div class="skeleton-back-btn shimmer"></div>
      </div>

      <div class="row align-items-start mb-5">
        <div class="col-12 col-md-4 mb-4 mb-md-0 text-center">
          <div class="skeleton-img shimmer"></div>
        </div>
        <div class="col-12 col-md-8">
          <div class="skeleton-title shimmer mb-3"></div>
          <div class="skeleton-tag shimmer mb-2"></div>
          <div class="skeleton-tag shimmer mb-4"></div>
          <div class="skeleton-btn shimmer mb-3"></div>
          <div class="skeleton-btn shimmer mb-3"></div>
        </div>
      </div>

      <div class="skeleton-section-title shimmer mb-3"></div>
      <div class="skeleton-line shimmer mb-2" *ngFor="let i of [1,2,3,4]"></div>

      <div class="skeleton-section-title shimmer mt-5 mb-3"></div>
      <div class="skeleton-line shimmer mb-2" *ngFor="let i of [1,2,3,4,5,6,7]"></div>
    </div>
  `,
  styles: [`
    .skeleton-img {
      width: 100%;
      height: 280px;
      border-radius: 1rem;
      background-color: #e0e0e0;
    }
    .skeleton-title {
      width: 60%;
      height: 24px;
      background-color: #e0e0e0;
      border-radius: 8px;
    }
    .skeleton-tag {
      width: 40%;
      height: 20px;
      background-color: #e0e0e0;
      border-radius: 12px;
    }
    .skeleton-btn {
      width: 50%;
      height: 36px;
      background-color: #e0e0e0;
      border-radius: 8px;
    }
    .skeleton-section-title {
      width: 30%;
      height: 20px;
      background-color: #e0e0e0;
      border-radius: 8px;
    }
    .skeleton-line {
      width: 100%;
      height: 16px;
      background-color: #e0e0e0;
      border-radius: 6px;
    }
    .skeleton-back-btn {
      width: 200px;
      height: 36px;
      background-color: #e0e0e0;
      border-radius: 6px;
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
export class SkeletonRecipeDetailComponent {}
