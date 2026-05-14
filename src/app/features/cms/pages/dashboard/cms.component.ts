import { Component, inject, HostListener, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/auth/services/auth.service';
import { APP_ROUTES } from '../../../../core/constants/app-routes.constants';
import { CmsService } from '../../services/cms.service';

@Component({
  selector: 'app-cms',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cms.component.html',
  styleUrl: './cms.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class CmsComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private cmsService = inject(CmsService);
  private cdr = inject(ChangeDetectorRef);

  notifications: any;
  activeDropdown: string | null = null;
  myInfo: any;
  users: any[] = [];
  totalUsers = 0;
  userName: any;
  userEmail: any;

  // pagination
  items: any[] = [];
  teamComps: any[] = [];
  totalItems = 0;
  totalTeamComps = 0;
  currentPage = 0;
  pageSize = 10;


  ngOnInit(): void {
    this.userName = this.authService.getUserInfo()?.username || 'Admin';
    this.userEmail = this.authService.getUserInfo()?.username || '';
    this.cmsService.notification().subscribe((res: any) => {
      this.notifications = res.data;
    });
    this.cmsService.myInfo().subscribe((res: any) => {
      this.myInfo = res.data;
    });

    this.cmsService.getUser().subscribe((res: any) => {
      const apiData = res.data ? res.data : res;
      this.totalUsers = apiData.totalElements || 0;
      this.cdr.markForCheck();
    });
    this.getItems();
    this.getTeamComps();
  }

  getItems() {
    this.cmsService.getItems(this.currentPage, this.pageSize).subscribe((res: any) => {
      const apiData = res.data ? res.data : res;
      this.items = apiData.content || [];
      this.totalItems = apiData.totalElements || 0;
      this.currentPage = apiData.page || 0;
      this.pageSize = apiData.size || 10;
      this.cdr.markForCheck();
    });
  }

  getTeamComps() {
    this.cmsService.getTeamComps(this.currentPage, this.pageSize).subscribe((res: any) => {
      const apiData = res.data ? res.data : res;
      this.teamComps = apiData.content || [];
      this.totalTeamComps = apiData.totalElements || 0;
      this.currentPage = apiData.page || 0;
      this.pageSize = apiData.size || 10;
      this.cdr.markForCheck();
    });
  }
  get stats() {
    return [
      { label: 'Tướng', value: '58' },
      { label: 'Items', value: this.totalItems },
      { label: 'Đội hình', value: this.totalTeamComps },
      { label: 'Users', value: this.totalUsers }
    ];
  }


  toggleDropdown(name: string, event: Event) {
    event.stopPropagation();
    this.activeDropdown = this.activeDropdown === name ? null : name;
  }

  @HostListener('document:click')
  closeDropdowns() {
    this.activeDropdown = null;
  }

  logout() {
    this.authService.logout();
    this.router.navigate([APP_ROUTES.LOGIN]);
  }
}
