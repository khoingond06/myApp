import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ItemService } from '../../services/item.service';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';
import { FormsModule } from '@angular/forms';

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
  page = 0;
  size = 10;
  totalPages = 0;
  totalElements = 0;

  keyword: string ='';

  items: any[] = [];

  ngOnInit(): void {
    this.getItems();
  }

  getItems = () => {
    this.itemService.getItems(this.page, this.size,this.keyword).subscribe((res: any) => {
      const apiData = res.data ? res.data : res;
      this.items = apiData.content || [];
      this.totalElements = apiData.totalElements || 0;
      this.totalPages = apiData.totalPages || 0;
      this.cdr.markForCheck();
    })
  }
  searchData = () => {
    this.page = 0;
    this.getItems();
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
}
