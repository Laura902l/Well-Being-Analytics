import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: 'navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  auth = inject(AuthService);
  router = inject(Router);
  open = false;

  toggle() {
    this.open = !this.open;
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
