import { Component, inject, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CmsService } from '../../services/cms.service';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';

@Component({
  selector: 'app-set-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, PaginationComponent],
  templateUrl: './set-list.component.html',
  styleUrl: './set-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SetListComponent implements OnInit {
  private cdr = inject(ChangeDetectorRef);
  private cmsService = inject(CmsService);
  private router = inject(Router);
  sets: any[] = [];

  // pagination
  page: number = 0;
  size: number = 10;
  totalPages: number = 0;
  totalElements: number = 0;
  selectedIds = new Set<number>();

  keyword: string = '';
  showFilterModal: boolean = false;
  filterStatus: string = 'All';
  tempFilterStatus: string = 'All';  // giá trị tạm

  activeDropdownId: number | null = null;


  toggleDropdown(id: number, event: MouseEvent) {
    event.stopPropagation();
    this.activeDropdownId = this.activeDropdownId === id ? null : id;
    this.cdr.markForCheck();
  }

  constructor() {
  }

  ngOnInit(): void {
    this.getData();
  }

  getData = () => {
    this.cmsService.getSets(this.page, this.size, this.keyword, this.filterStatus).subscribe((res: any) => {
      const apiData = res.data ? res.data : res;

      this.sets = apiData.content || [];
      this.totalPages = apiData.totalPages || 0;
      this.totalElements = apiData.totalElements || 0;
      this.selectedIds.clear();
      this.cdr.markForCheck();
    });
  }

  searchData = () => {
    this.page = 0;
    this.getData();
  }

  openFilterModal() {
    this.tempFilterStatus = this.filterStatus;
    this.showFilterModal = true;
    this.cdr.markForCheck();
  }

  closeFilterModal() {
    this.showFilterModal = false;
    this.cdr.markForCheck();
  }

  applyFilter() {
    this.filterStatus = this.tempFilterStatus;
    this.page = 0;
    this.showFilterModal = false;
    this.getData();
  }


  deleteSet = (id: number) => {
    if (confirm('Bạn có chắc chắn muốn xóa?')) {
      this.cmsService.deleteSet(id).subscribe((res: any) => {
        this.getData();
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

  isAllSelected() {
    return this.sets.length > 0 && this.sets.every(set => this.selectedIds.has(set.id));
  }

  toggleAllSelection() {
    if (this.isAllSelected()) {
      this.sets.forEach(set => this.selectedIds.delete(set.id));
    } else {
      this.sets.forEach(set => this.selectedIds.add(set.id));
    }
    this.cdr.markForCheck();
  }

  deleteSelected() {
    if (this.selectedIds.size === 0) return;

    if (confirm(`Bạn có chắc chắn muốn xóa ${this.selectedIds.size} mục đã chọn?`)) {
      const idsToDelete = Array.from(this.selectedIds);
      this.selectedIds.clear();
      this.cdr.markForCheck();

      this.cmsService.deleteSets(idsToDelete).subscribe({
        next: (res: any) => {
          if (res && res.success === false) {
            alert('Có lỗi xảy ra: ' + (res.message || 'Lỗi khi xóa'));
          } else {
            this.sets = this.sets.map(set => 
              idsToDelete.includes(set.id) ? { ...set, deleted: true } : set
            );
            this.cdr.markForCheck();
          }
          this.getData();
        },
        error: (err: any) => {
          alert('Có lỗi xảy ra: ' + (err?.error?.message || 'Lỗi hệ thống'));
          this.getData();
        }
      });
    }
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

    this.getData();
  }

  changePageSize = (pageSize: number) => {
    this.size = pageSize;
    this.page = 0;
    this.getData();
  }
}
