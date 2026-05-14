import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CmsService } from '../../../services/cms.service';

@Component({
  selector: 'app-set-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './set-edit.component.html',
  styleUrl: './set-edit.component.scss'
})
export class SetEditComponent implements OnInit {
  private fb = inject(FormBuilder);
  private cmsService = inject(CmsService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  editForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(255)]],
    description: ['', [Validators.maxLength(1000)]],
    deleted: [false]
  });

  setId: number | null = null;
  isLoading = true;

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.setId = +params['id'];
      if (this.setId) {
        this.loadSetData(this.setId);
      }
    });
  }

  loadSetData(id: number) {
    this.isLoading = true;
    this.cmsService.getSetById(id).subscribe({
      next: (res: any) => {
        const data = res.data || res;
        this.editForm.patchValue({
          name: data.name,
          description: data.description,
          deleted: data.deleted
        });
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading set data', err);
        alert('Không thể tải thông tin mùa giải');
        this.isLoading = false;
        this.goBack();
      }
    });
  }

  onSubmit() {
    if (this.editForm.invalid|| !this.setId) return;

    this.cmsService.updateSet(this.setId, this.editForm.value).subscribe({
      next: (res: any) => {
        if (res.success !== false) {
           alert('Cập nhật mùa giải thành công!');
           this.router.navigate(['/cms/sets']);
        } else {
           alert('Có lỗi xảy ra: ' + res.message);
        }
      },
      error: (err: any) => {
        alert('Có lỗi xảy ra: ' + (err?.error?.message || 'Lỗi hệ thống'));
      }
    });
  }

  goBack() {
    this.router.navigate(['/cms/sets']);
  }
}
