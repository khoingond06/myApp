import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TraitService } from '../../services/trait.service';
import { CmsService } from '../../services/cms.service';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';

@Component({
  selector: 'app-trait',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, PaginationComponent],
  templateUrl: './trait.component.html',
  styleUrl: './trait.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TraitComponent {
  private traitService = inject(TraitService);
  private cmsService = inject(CmsService);
  private cdr = inject(ChangeDetectorRef);

  traits: any[] = [];
  sets: any[] = [];
  selectedIds = new Set<number>();

  page = 0;
  size = 10;
  totalPages = 0;
  totalElements = 0;

  keyword: string = '';
  activeDropdownId: number | null = null;

  // Filter (applied)
  filterSet: string = '';
  filterTraitStatus: string = '';
  filterType: string = '';
  filterRestoreStatus: string = '';

  // Temp filter (for modal)
  tempFilterSet: string = '';
  tempFilterTraitStatus: string = '';
  tempFilterType: string = '';
  tempFilterRestoreStatus: string = '';
  showFilterModal = false;

  ngOnInit(): void {
    this.getTraits();
    this.getSets();
  }

  getTraits() {
    this.traitService.getTraits(
      this.page, this.size, this.keyword,
      this.filterSet, this.filterType, this.filterTraitStatus, this.filterRestoreStatus
    ).subscribe((res: any) => {
      const apiData = res.data ? res.data : res;
      this.traits = apiData.content || [];
      this.totalPages = apiData.totalPages || 0;
      this.totalElements = apiData.totalElements || 0;
      this.cdr.markForCheck();
    });
  }

  getSets() {
    this.cmsService.getSets(0, 100).subscribe((res: any) => {
      const apiData = res.data ? res.data : res;
      this.sets = apiData.content || apiData;
      this.cdr.markForCheck();
    });
  }

  searchData() {
    this.page = 0;
    this.getTraits();
  }

  toggleDropdown(id: number, event: MouseEvent) {
    event.stopPropagation();
    this.activeDropdownId = this.activeDropdownId === id ? null : id;
    this.cdr.markForCheck();
  }

  // Filter modal
  openFilterModal() {
    this.tempFilterSet = this.filterSet;
    this.tempFilterTraitStatus = this.filterTraitStatus;
    this.tempFilterType = this.filterType;
    this.tempFilterRestoreStatus = this.filterRestoreStatus;
    this.showFilterModal = true;
    this.cdr.markForCheck();
  }

  closeFilterModal() {
    this.showFilterModal = false;
    this.cdr.markForCheck();
  }

  applyFilter() {
    this.filterSet = this.tempFilterSet;
    this.filterTraitStatus = this.tempFilterTraitStatus;
    this.filterType = this.tempFilterType;
    this.filterRestoreStatus = this.tempFilterRestoreStatus;
    
    this.page = 0;
    this.showFilterModal = false;
    this.getTraits();
  }

  resetFilter() {
    this.tempFilterSet = '';
    this.tempFilterTraitStatus = '';
    this.tempFilterType = '';
    this.tempFilterRestoreStatus = '';
    this.cdr.markForCheck();
  }

  // Selection
  toggleSelection(id: number) {
    if (this.selectedIds.has(id)) {
      this.selectedIds.delete(id);
    } else {
      this.selectedIds.add(id);
    }
    this.cdr.markForCheck();
  }

  isAllSelected() {
    return this.traits.length > 0 && this.traits.every(t => this.selectedIds.has(t.id));
  }

  toggleAllSelection() {
    if (this.isAllSelected()) {
      this.traits.forEach(t => this.selectedIds.delete(t.id));
    } else {
      this.traits.forEach(t => this.selectedIds.add(t.id));
    }
    this.cdr.markForCheck();
  }

  deleteSelected() {
    if (this.selectedIds.size === 0) return;

    if (confirm(`Bạn có chắc chắn muốn xóa ${this.selectedIds.size} mục đã chọn?`)) {
      const idsToDelete = Array.from(this.selectedIds);
      this.selectedIds.clear();
      this.cdr.markForCheck();

      this.traitService.deleteTraits(idsToDelete).subscribe({
        next: (res: any) => {
          if (res && res.success === false) {
            alert('Có lỗi xảy ra: ' + (res.message || 'Lỗi khi xóa'));
          } else {
            this.traits = this.traits.map(t =>
              idsToDelete.includes(t.id) ? { ...t, deleted: true } : t
            );
            this.cdr.markForCheck();
          }
          this.getTraits();
        },
        error: (err: any) => {
          alert('Có lỗi xảy ra: ' + (err?.error?.message || 'Lỗi hệ thống'));
          this.getTraits();
        }
      });
    }
  }

  deleteTrait(id: number) {
    if (confirm('Bạn có chắc chắn muốn xóa?')) {
      this.traitService.deleteTrait(id).subscribe(() => {
        this.getTraits();
      });
    }
  }

  // Pagination
  changePage = (page: number) => {
    if (page < 0) {
      this.page = 0;
    } else if (page >= this.totalPages) {
      this.page = this.totalPages - 1;
    } else {
      this.page = page;
    }
    if (this.page < 0) this.page = 0;
    this.getTraits();
    this.cdr.markForCheck();
  }

  changePageSize = (pageSize: number) => {
    this.size = pageSize;
    this.page = 0;
    this.getTraits();
    this.cdr.markForCheck();
  }

  getBreakpointCounts(breakpoints: any[]): string {
    if (!breakpoints || breakpoints.length === 0) return '';
    return breakpoints.map(b => b.count).join(', ');
  }
}
