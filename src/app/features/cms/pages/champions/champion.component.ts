import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ChampionService } from '../../services/champion.service';
import { CmsService } from '../../services/cms.service';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';

@Component({
  selector: 'app-champion',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, PaginationComponent],
  templateUrl: './champion.component.html',
  styleUrl: './champion.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChampionComponent {
  private championService = inject(ChampionService);
  private cmsService = inject(CmsService);
  private cdr = inject(ChangeDetectorRef);

  champions: any[] = [];
  sets: any[] = [];
  selectedIds = new Set<number>();

  page = 0;
  size = 10;
  totalPages = 0;
  totalElements = 0;

  keyword: string = '';
  activeDropdownId: number | null = null;

  showFilterModal = false;
  // Filter (applied)
  filterCost: string = '';
  filterSet: string = '';
  filterChampStatus: string = '';
  filterTier: string = '';
  filterUnassignedSet: string = '';
  filterTrait: string = '';

  // Temp filter (for modal)
  tempFilterCost: string = '';
  tempFilterSet: string = '';
  tempFilterChampStatus: string = '';
  tempFilterTier: string = '';
  tempFilterUnassignedSet: string = '';
  tempFilterTrait: string = '';

  // All traits collected from API data
  allTraits: any[] = [];
  traitSearch: string = '';

  ngOnInit(): void {
    this.getChampions();
    this.getSets();
    this.loadTraits();
  }

  getChampions() {
    this.championService.getChampions(
      this.page, this.size, this.keyword,
      this.filterSet, this.filterCost, this.filterTrait,
      this.filterTier, this.filterChampStatus, this.filterUnassignedSet
    ).subscribe((res: any) => {
      const apiData = res.data ? res.data : res;
      this.champions = apiData.content || [];
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

  loadTraits() {
    this.cmsService.getTraits(0, 1000).subscribe((res: any) => {
      const apiData = res.data ? res.data : res;
      this.allTraits = apiData.content || apiData || [];
      this.cdr.markForCheck();
    });
  }

  get filteredTraits() {
    if (!this.traitSearch) return this.allTraits;
    const search = this.traitSearch.toLowerCase();
    return this.allTraits.filter(t => t.name.toLowerCase().includes(search));
  }

  searchData() {
    this.page = 0;
    this.getChampions();
  }

  toggleDropdown(id: number, event: MouseEvent) {
    event.stopPropagation();
    this.activeDropdownId = this.activeDropdownId === id ? null : id;
    this.cdr.markForCheck();
  }

  // Filter modal
  openFilterModal() {
    this.tempFilterCost = this.filterCost;
    this.tempFilterSet = this.filterSet;
    this.tempFilterChampStatus = this.filterChampStatus;
    this.tempFilterTier = this.filterTier;
    this.tempFilterUnassignedSet = this.filterUnassignedSet;
    this.tempFilterTrait = this.filterTrait;
    this.showFilterModal = true;
    this.cdr.markForCheck();
  }

  closeFilterModal() {
    this.showFilterModal = false;
    this.cdr.markForCheck();
  }

  applyFilter() {
    this.filterCost = this.tempFilterCost;
    this.filterSet = this.tempFilterSet;
    this.filterChampStatus = this.tempFilterChampStatus;
    this.filterTier = this.tempFilterTier;
    this.filterUnassignedSet = this.tempFilterUnassignedSet;
    this.filterTrait = this.tempFilterTrait;
    
    this.page = 0;
    this.showFilterModal = false;
    this.getChampions();
  }

  resetFilter() {
    this.tempFilterCost = '';
    this.tempFilterSet = '';
    this.tempFilterChampStatus = '';
    this.tempFilterTier = '';
    this.tempFilterUnassignedSet = '';
    this.tempFilterTrait = '';
    this.traitSearch = '';
    this.cdr.markForCheck();
  }

  selectCost(cost: string) {
    this.tempFilterCost = this.tempFilterCost === cost ? '' : cost;
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
    return this.champions.length > 0 && this.champions.every(c => this.selectedIds.has(c.id));
  }

  toggleAllSelection() {
    if (this.isAllSelected()) {
      this.champions.forEach(c => this.selectedIds.delete(c.id));
    } else {
      this.champions.forEach(c => this.selectedIds.add(c.id));
    }
    this.cdr.markForCheck();
  }

  deleteSelected() {
    if (this.selectedIds.size === 0) return;

    if (confirm(`Bạn có chắc chắn muốn xóa ${this.selectedIds.size} mục đã chọn?`)) {
      const idsToDelete = Array.from(this.selectedIds);
      this.selectedIds.clear();
      this.cdr.markForCheck();

      this.championService.deleteChampions(idsToDelete).subscribe({
        next: (res: any) => {
          if (res && res.success === false) {
            alert('Có lỗi xảy ra: ' + (res.message || 'Lỗi khi xóa'));
          } else {
            this.champions = this.champions.map(c =>
              idsToDelete.includes(c.id) ? { ...c, deleted: true } : c
            );
            this.cdr.markForCheck();
          }
          this.getChampions();
        },
        error: (err: any) => {
          alert('Có lỗi xảy ra: ' + (err?.error?.message || 'Lỗi hệ thống'));
          this.getChampions();
        }
      });
    }
  }

  deleteChampion(id: number) {
    if (confirm('Bạn có chắc chắn muốn xóa?')) {
      this.championService.deleteChampion(id).subscribe(() => {
        this.getChampions();
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
    this.getChampions();
    this.cdr.markForCheck();
  }

  changePageSize = (pageSize: number) => {
    this.size = pageSize;
    this.page = 0;
    this.getChampions();
    this.cdr.markForCheck();
  }
}
