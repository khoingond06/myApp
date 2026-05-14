import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss'
})
export class PaginationComponent {
  @Input() page: number = 0;
  @Input() size: number = 10;
  @Input() totalPages: number = 0;
  @Input() totalElements: number = 0;

  @Output() pageChange = new EventEmitter<number>();
  @Output() sizeChange = new EventEmitter<number>();

  changePage(newPage: number) {
    if (newPage >= 0 && newPage < this.totalPages) {
      this.pageChange.emit(newPage);
    }
  }

  changeSize(newSize: string) {
    this.sizeChange.emit(Number(newSize));
  }


  get endItem(): number {
    const end = (this.page + 1) * this.size;
    return end > this.totalElements ? this.totalElements : end;
  }
}
