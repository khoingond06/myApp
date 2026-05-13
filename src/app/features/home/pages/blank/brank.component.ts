import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/auth/services/auth.service';
import { APP_ROUTES } from '../../../../core/constants/app-routes.constants';

@Component({
  selector: 'app-brank',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './brank.component.html',
  styleUrl: './brank.component.scss'
})
export class BrankComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  userName = this.authService.getUserInfo()?.username || 'Người dùng';
  currentLang = 'VN';

  changeLang(lang: string) {
    this.currentLang = lang;
  }

  logout() {
    this.authService.logout();
    this.router.navigate([APP_ROUTES.LOGIN]);
  }
}
