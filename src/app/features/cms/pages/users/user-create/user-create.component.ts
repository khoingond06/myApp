import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { Router } from '@angular/router';
import { RoleService } from '../../../services/role.service';
import { FormErrorComponent } from '../../../../../shared/components/form-error/form-error.component';

@Component({
  selector: 'app-user-create.component',
  imports: [ReactiveFormsModule, CommonModule, FormErrorComponent],
  templateUrl: './user-create.component.html',
  styleUrl: './user-create.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserCreateComponent {
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private router = inject(Router);
  private roleService = inject(RoleService);
  private cdr = inject(ChangeDetectorRef);
  roles: any[] = [];
  


  createForm: FormGroup = this.fb.group({
    username: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    roleId: [null, [Validators.required]],
    roleCode: ['', [Validators.required]],
    defaultPassword: ['', [Validators.required, Validators.minLength(8)]],
  });

  ngOnInit(): void {
    this.getRole();
  }

  getRole() {
    this.roleService.getAll().subscribe((res: any) => {
      // API thường trả về data.content cho danh sách phân trang
      if (res.data && res.data.content) {
        this.roles = res.data.content;
      } else if (res.data) {
        this.roles = res.data;
      } else {
        this.roles = res;
      }
      console.log('Danh sách roles thực tế:', this.roles);
      this.cdr.markForCheck();
    });
  }
  onRoleChange(event:any){
    const id = event?.target.value;
    const role = this.roles.find((r:any)=> r.id == id);
    if (role){
      this.createForm.patchValue(
        { roleId: role.id, 
          roleCode: role.code 
        });
    }
  }


  onSubmit() {
    if (this.createForm.invalid) {
      alert('Vui lòng điền đầy đủ thông tin');
      return;
    }

    this.userService.createUser(this.createForm.value).subscribe({
      next: (res: any) => {
        alert('Thêm người dùng thành công!');
        this.router.navigate(['/cms/users']);
      },
      error: (err) => {
        console.error(err);
        alert('Có lỗi xảy ra: ' + (err.error?.message || 'Không thể tạo người dùng'));
      }
    });
  }
}
