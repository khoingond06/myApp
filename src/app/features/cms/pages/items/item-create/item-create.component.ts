import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ItemService } from '../../../services/item.service';
import { CmsService } from '../../../services/cms.service';

@Component({
  selector: 'app-item-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './item-create.component.html',
  styleUrl: './item-create.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ItemCreateComponent implements OnInit {
  private fb = inject(FormBuilder);
  private itemService = inject(ItemService);
  private router = inject(Router);
  private cmsService = inject(CmsService);
  private cdr = inject(ChangeDetectorRef);
  page = 0;
  size = 10;


  createForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(255)]],
    setId: ['', [Validators.required]],
    tier: [''],
    imageUrl: [''],
    stats: this.fb.group({
      attackDamage: [0],
      abilityPower: [0],
      armor: [0],
      magicResist: [0],
      attackSpeed: [0],
      health: [0]
    }),
    effects: this.fb.group({
      description: ['']
    }),
    deleted: [false]
  });

  isSubmitting = false;
  sets: any[] = [];
  tiers: string[] = ['Common', 'Rare', 'Epic', 'Legendary', 'Radiant'];

  ngOnInit(): void {
    this.getSets();
  }

  getSets() {
    this.cmsService.getSets(0, 100).subscribe((res: any) => {
      const apiData = res.data ? res.data : res;
      this.sets = apiData.content || [];
      this.cdr.markForCheck();
    })
  }

  onSubmit() {
    if (this.createForm.invalid || this.isSubmitting) return;

    const formData = {
      ...this.createForm.value,
      setId: Number(this.createForm.value.setId)
    };

    this.isSubmitting = true;
    this.cdr.markForCheck();

    this.itemService.createItem(formData).subscribe({
      next: (res: any) => {
        this.isSubmitting = false;
        if (res.success !== false) {
           alert('Thêm trang bị thành công!');
           this.router.navigate(['/cms/items']);
        } else {
           alert('Có lỗi xảy ra: ' + res.message);
        }
        this.cdr.markForCheck();
      },
      error: (err: any) => {
        this.isSubmitting = false;
        alert('Có lỗi xảy ra: ' + (err?.error?.message || 'Lỗi hệ thống'));
        this.cdr.markForCheck();
      }
    });
  }

  goBack() {
    this.router.navigate(['/cms/items']);
  }
}
