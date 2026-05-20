import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ItemService } from '../../services/item.service';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';
import { FormsModule } from '@angular/forms';
import { CmsService } from '../../services/cms.service';

@Component({
  selector: 'app-item.component',
  imports: [CommonModule, RouterLink, PaginationComponent,FormsModule],
  templateUrl: './item.component.html',
  styleUrl: './item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,

})
export class ItemComponent {
  private itemService = inject(ItemService);
  private cdr = inject(ChangeDetectorRef);
  private cmsService = inject(CmsService);
  selectedIds = new Set<number>();
  page = 0;
  size = 10;
  totalPages = 0;
  totalElements = 0;

  keyword: string ='';
  sets:any[] =[];
  items: any[] = [];
  activeDropdownId: number | null = null;
  showFilterModal = false;
  filterset: string ='';
  filterTier: string ='';
  filterItemStatus: string =''
  filterSetStatus: string =''


  ngOnInit(): void {
    this.getItems();
    this.getSets();
  }
  toggleDropdown(id: number, event: MouseEvent) {
    event.stopPropagation();
    this.activeDropdownId = this.activeDropdownId === id ? null : id;
    this.cdr.markForCheck();
  }

  getItems = () => {
    this.itemService.getItems(this.page, this.size,this.keyword,this.filterset,this.filterTier,this.filterItemStatus,this.filterSetStatus).subscribe((res: any) => {
      const apiData = res.data ? res.data : res;
      this.items = apiData.content || [];
      this.totalElements = apiData.totalElements || 0;
      this.totalPages = apiData.totalPages || 0;
      this.cdr.markForCheck();
    })
  }
  getSets = () => {
    this.cmsService.getSets(this.page,this.size).subscribe((res: any) => {
      const apiData = res.data ? res.data : res;
      this.sets = apiData.content || [];
      this.cdr.markForCheck();
      console.log(this.sets);
    })
  }
  searchData = () => {
    this.page = 0;
    this.getItems();
  }
  openfiltermodal(){
    this.showFilterModal = true;
    this.cdr.markForCheck();
  }

  applyFilter() {
    this.filterset;
    this.filterItemStatus;
    this.filterSetStatus;
    this.filterTier
    this.page = 0;
    this.getItems();
    this.cdr.markForCheck();
  }
  resetFilter(){
    this.filterset = '';
    this.filterItemStatus = '';
    this.filterSetStatus = '';
    this.filterTier = '';
    this.page = 0;
    this.getItems();
    this.cdr.markForCheck();
  }
  changePage = (page: number) => {
    if (page < 0) {
      this.page = 0;
    } else if (page >= this.totalPages) {
      this.page = this.totalPages - 1;
    } else {
      this.page = page;
    }
    this.getItems();
  }
  changePageSize = (pageSize : number) => {
    this.size = pageSize;
    this.page = 0;
    this.getItems();
  }
  toggleSelection(id: number) {
    if (this.selectedIds.has(id)) {
      this.selectedIds.delete(id);
    } else {
      this.selectedIds.add(id);
    }
    this.cdr.markForCheck();
  }
  deleteSelected() {
    if (this.selectedIds.size === 0) return;

    if (confirm(`Bạn có chắc chắn muốn xóa ${this.selectedIds.size} mục đã chọn?`)) {
      const idsToDelete = Array.from(this.selectedIds);
      this.selectedIds.clear();
      this.cdr.markForCheck();

      this.itemService.deleteItems(idsToDelete).subscribe({
        next: (res: any) => {
          if (res && res.success === false) {
            alert('Có lỗi xảy ra: ' + (res.message || 'Lỗi khi xóa'));
          } else {
            this.items = this.items.map(item => 
              idsToDelete.includes(item.id) ? { ...item, deleted: true } : item
            );
            this.cdr.markForCheck();
          }
          this.getItems();
        },
        error: (err: any) => {
          alert('Có lỗi xảy ra: ' + (err?.error?.message || 'Lỗi hệ thống'));
          this.getItems();
        }
      });
    }
  }
  isAllSelected() {
    return this.items.length > 0 && this.items.every(item => this.selectedIds.has(item.id));
  }

  toggleAllSelection() {
    if (this.isAllSelected()) {
      this.items.forEach(item => this.selectedIds.delete(item.id));
    } else {
      this.items.forEach(item => this.selectedIds.add(item.id));
    }
    this.cdr.markForCheck();
  }
  deleteItem = (id: number) => {
    if (confirm('Bạn có chắc chắn muốn xóa?')) {
      this.itemService.deleteItem(id).subscribe((res: any) => {
        this.getItems ();
      });
    }
  }
}

