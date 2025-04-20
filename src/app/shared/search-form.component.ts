import { Component, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-search-form',
  standalone: true,
  imports: [CommonModule],
  template: `
    <form (submit)="onSubmit($event)" class="search-form mb-5 text-center">
      <div class="input-group justify-content-center">
        <input
          type="text"
          class="form-control input-main"
          placeholder="Search recipes..."
          [value]="query()"
          (input)="query.set($any($event.target).value)"
        />
        <button class="btn btn-main" type="submit">Search</button>
      </div>
    </form>
  `,
  styles: [` 
   .search-form .input-group {
  max-width: 600px;
  margin: 0 auto;
}
.input-main {
  border: 2px solid #D64541;
  border-right: none;
  border-radius: 0.5rem 0 0 0.5rem;
}
.input-main:focus {
  box-shadow: none;
  border-color: #A2342F;
}
.btn-main {
  background-color: #D64541;
  border: none;
  border-radius: 0 0.5rem 0.5rem 0;
  color: #ffffff;
}
.btn-main:hover {
  background-color: #A2342F;
}
    @media (max-width: 768px) {
      .search-form {
        width: 100%;
      }
    }
  `]
})
export class SearchFormComponent {
  query = signal('');
  searchSubmit = output<string>();

  onSubmit(event: Event) {
    event.preventDefault();
    const trimmed = this.query().trim();
    if (trimmed) this.searchSubmit.emit(trimmed);
  }
}
