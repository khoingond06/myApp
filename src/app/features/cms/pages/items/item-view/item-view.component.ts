import { Component, inject } from '@angular/core';
import { ItemService } from '../../../services/item.service';

@Component({
  selector: 'app-item-view.component',
  imports: [],
  templateUrl: './item-view.component.html',
  styleUrl: './item-view.component.scss',
})
export class ItemViewComponent {
  private itemService = inject(ItemService);
  getItem(){
    this.itemService.findById(0);
  }
}
