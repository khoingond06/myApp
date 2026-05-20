import { Component, inject, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';
import { PaginationComponent } from "../../../../shared/components/pagination/pagination.component";
import { FormsModule } from '@angular/forms';
import { RoleService } from '../../services/role.service';
@Component({
  selector: 'app-user.component',
  standalone: true,
  imports: [CommonModule, RouterLink, PaginationComponent, FormsModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserComponent implements OnInit {
  private userService = inject(UserService);
  private cdr = inject(ChangeDetectorRef);
  private roleService = inject(RoleService);
  users: any[] = [];
  page: number = 0;
  size: number = 10;
  totalPages: number = 0;
  totalElements: number = 0;
  keyword: string = '';
  filterStatus: string = 'All';
  tempFilterStatus: string = 'All';
  filterRole: string = 'All';
  tempFilterRole: string = 'All';
  roles: any[] = ['Admin','User','Editor'];
  showFilterModal: boolean = false;
  selectedIds = new Set<number>();


  activeDropdownId: number | null = null;
  ngOnInit(): void {
    this.getUsers();
    this.getRole();
  }
  getUsers() {
    this.userService.getUsers(this.page, this.size, this.keyword, this.filterStatus,this.filterRole).subscribe((res: any) => {
      const data = res.data ? res.data : res;

      this.users = data.content || [];
      this.totalElements = data.totalElements || 0;
      this.totalPages = data.totalPages || 0;
      this.selectedIds.clear();
      this.cdr.markForCheck();
    })
  }
  getRole() {
    this.roleService.getAll().subscribe((res: any) => {
      const data = res.data ? res.data : res;
      this.roles = data;
      this.cdr.markForCheck();
    })
  }
  toggleDropdown(id: number, event: MouseEvent){
    this.activeDropdownId = this.activeDropdownId === null ? id : null;
    this.cdr.markForCheck();
  }
  searchData() {
    this.page = 0;
    this.getUsers();
    this.cdr.markForCheck();
  }
  openFilterModal(){
    this.tempFilterStatus = this.filterStatus; // copy giá trị hiện tại vào modal
    this.tempFilterRole = this.filterRole; // copy giá trị hiện tại vào modal
    this.showFilterModal = true;
    this.cdr.markForCheck();
  }
  closeFilterModal(){
    this.showFilterModal = false;
  }
  applyFilter(){
    this.filterStatus = this.tempFilterStatus; // xác nhận filter
    this.filterRole = this.tempFilterRole; // xác nhận filter
    this.page = 0;
    this.getUsers();
    this.closeFilterModal();
  }

  changePage = (page: number) => {
    if (page < 0) {
      this.page = 0;
    } else if (page >= this.totalPages) {
      this.page = this.totalPages - 1;
    } else {
      this.page = page;
    }
    if (this.page < 0) this.page = 0;

    this.getUsers();
  }

  changePageSize = (pageSize: number) => {
    this.size = pageSize;
    this.page = 0;
    this.getUsers();
  }
  deleteUser = (id: number) => {
    if (confirm('Bạn có chắc chắn muốn xóa?')) {
      this.userService.deleteUser(id).subscribe((res: any) => {
        this.getUsers();
        this.cdr.markForCheck();
      });
    }
  }
    toggleSelection(id: number) {
    if (this.selectedIds.has(id)) {
      this.selectedIds.delete(id);
    } else {
      this.selectedIds.add(id);
    }
    this.cdr.markForCheck();
  }
    toggleAllSelection() {
    if (this.isAllSelected()) {
      this.users.forEach(user => this.selectedIds.delete(user.id));
    } else {
      this.users.forEach(user => this.selectedIds.add(user.id));
    }
    this.cdr.markForCheck();
  }
  isAllSelected() {
    return this.users.length > 0 && this.users.every(user => this.selectedIds.has(user.id));
  }

  deleteSelected() {
    if (this.selectedIds.size === 0) return;

    if (confirm(`Bạn có chắc chắn muốn xóa ${this.selectedIds.size} mục đã chọn?`)) {
      const idsToDelete = Array.from(this.selectedIds);
      this.selectedIds.clear();
      this.cdr.markForCheck();

      this.userService.deleteUsers(idsToDelete).subscribe({
        next: (res: any) => {
          if (res && res.success === false) {
            alert('Có lỗi xảy ra: ' + (res.message || 'Lỗi khi xóa'));
          } else {
            this.users = this.users.map(user => 
              idsToDelete.includes(user.id) ? { ...user, deleted: true } : user
            );
            this.cdr.markForCheck();
          }
          this.getUsers();
        },
        error: (err: any) => {
          alert('Có lỗi xảy ra: ' + (err?.error?.message || 'Lỗi hệ thống'));
          this.getUsers();
        }
      });
    }
  }
}
