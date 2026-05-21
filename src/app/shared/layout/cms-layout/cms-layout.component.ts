import { Component, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../../../core/auth/services/auth.service';
import { CmsService } from '../../../features/cms/services/cms.service';
import { APP_ROUTES } from '../../../core/constants/app-routes.constants';
import { LanguageService } from '../../../core/services/language.service';

@Component({
  selector: 'app-cms-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, TranslateModule],
  templateUrl: './cms-layout.component.html',
  styleUrl: './cms-layout.component.scss'
})
export class CmsLayoutComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private cmsService = inject(CmsService);
  public languageService = inject(LanguageService);

  userName = this.authService.getUserInfo()?.username || 'Admin';

  activeDropdown: string | null = null;
  notifications: any[] = [];
  myInfo: any[] = [];

  ngOnInit(): void {
    this.cmsService.notification().subscribe((res: any) => this.notifications = res.data);
    this.cmsService.myInfo().subscribe((res: any) => this.myInfo = res.data);
  }

  toggleDropdown(name: string, event: Event) {
    event.stopPropagation();
    this.activeDropdown = this.activeDropdown === name ? null : name;
  }

  @HostListener('document:click')
  closeDropdowns() {
    this.activeDropdown = null;
  }

  get currentTitle(): string {
    const url = this.router.url;
    if (url.includes('/cms/dashboard')) return 'cms';
    if (url.includes('/cms/sets')) return 'sets';
    if (url.includes('/cms/sets/create')) return 'create';
    if (url.includes('/cms/items')) return 'items';
    if (url.includes('/cms/champions')) return 'champions';
    if (url.includes('/cms/teams')) return 'teams';
    if (url.includes('/cms/users')) return 'users';
    if (url.includes('/cms/notification')) return 'notification';
    return 'Cms';
  }

  logout() {
    this.authService.logout();
    this.router.navigate([APP_ROUTES.LOGIN]);
  }
}
