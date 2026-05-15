import { Component, inject, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';
import { PaginationComponent } from "../../../../shared/components/pagination/pagination.component";
import { FormsModule } from '@angular/forms';
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
  users: any[] = [];
  page: number = 0;
  size: number = 10;
  totalPages: number = 0;
  totalElements: number = 0;
  keyword: string = '';
  filterStatus: string = 'All';
  tempFilterStatus: string = 'All';
  showFilterModal: boolean = false;

  activeDropdownId: number | null = null;
  ngOnInit(): void {
    this.getUsers();
  }
  getUsers() {
    this.userService.getUsers(this.page, this.size, this.keyword, this.filterStatus).subscribe((res: any) => {
      const data = res.data ? res.data : res;
      this.users = data.content || [];
      this.totalElements = data.totalElements || 0;
      this.totalPages = data.totalPages || 0;
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
    this.showFilterModal = true;
    this.cdr.markForCheck();
  }
  closeFilterModal(){
    this.showFilterModal = false;
  }
  applyFilter(){
    this.filterStatus = this.tempFilterStatus; // xác nhận filter
    this.page = 0;
    this.getUsers();
    this.closeFilterModal();
  }
  deleteUser(id: number){
    this.userService.deleteUser(id).subscribe(() => {
      this.getUsers();
      this.cdr.markForCheck();
    })
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
}
