import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CmsService } from '../../../services/cms.service';


@Component({
  selector: 'app-set-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './set-create.component.html',
  styleUrl: './set-create.component.scss'
})
export class SetCreateComponent {
  private fb = inject(FormBuilder);
  private cmsService = inject(CmsService);
  private router = inject(Router);

  createForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(255)]],
    description: ['', [Validators.maxLength(1000)]]
  });

  isSubmitting = false;

  onSubmit() {
    if (this.createForm.invalid || this.isSubmitting) return;

    this.isSubmitting = true;
    this.cmsService.createSet(this.createForm.value).subscribe({
      next: (res: any) => {
        this.isSubmitting = false;
        if (res.success !== false) {
           alert('Thêm mùa giải thành công!');
           this.router.navigate(['/cms/sets']);
        } else {
           alert('Có lỗi xảy ra: ' + res.message);
        }
      },
      error: (err: any) => {
        this.isSubmitting = false;
        alert('Có lỗi xảy ra: ' + (err?.error?.message || 'Lỗi hệ thống'));
      }
    });
  }

  goBack() {
    this.router.navigate(['/cms/sets']);
  }
}
