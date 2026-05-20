import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { RoleService } from '../../../services/role.service';

@Component({
  selector: 'app-role-create',
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './role-create.html',
  styleUrl: './role-create.scss',
})
export class RoleCreate {
  public roleService = inject(RoleService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  createForm: FormGroup = this.fb.group({
    code: [''],
    name: ['', [Validators.required]],
    description: ['']
  });


  createRole() {
    if (this.createForm.invalid ) return;


    this.roleService.create(this.createForm.value).subscribe({
      next: (res: any) => {

        if (res.success !== false) {
           alert('Thêm vai trò thành công!');
           this.router.navigate(['/cms/role']);
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
    this.router.navigate(['/cms/role']);
  }
}
