import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { RoleService } from '../../../services/role.service';

@Component({
  selector: 'app-user-edit.component',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './user-edit.component.html',
  styleUrl: './user-edit.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserEditComponent implements OnInit {
  private userService = inject(UserService);
  private roleService = inject(RoleService);
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  user: any = null;
  userId: number | null = null;
  roles: any[] = [];

  editUserForm: FormGroup = this.fb.group({
    username: ['', [Validators.required, Validators.maxLength(255)]],
    email: ['', [Validators.required, Validators.email]],
    roleId: [null, [Validators.required]],
    roleCode: ['', [Validators.required]],
    enabled: [true]
  });

  ngOnInit(): void {
    this.getRoles();
    this.route.params.subscribe(params => {
      this.userId = +params['id'];
      if (this.userId) {
        this.loadUser(this.userId);
      }
    });
  }

  getRoles() {
    this.roleService.getAll().subscribe((res: any) => {
      this.roles = res.data?.content || res.data || [];
      this.cdr.markForCheck();
    });
  }

  loadUser(id: number) {
    this.userService.getUserById(id).subscribe((res: any) => {
      const data = res.data ? res.data : res;
      this.user = data;
      this.editUserForm.patchValue({
        username: this.user.username,
        email: this.user.email,
        roleId: this.user.roleId,
        roleCode: this.user.roleCode,
        enabled: this.user.enabled
      });
      this.cdr.markForCheck();
    });
  }

  onRoleChange(event: any) {
    const id = Number(event.target.value);
    const selectedRole = this.roles.find((r: any) => r.id == id);
    if (selectedRole) {
      this.editUserForm.patchValue({
        roleCode: selectedRole.code
      });
    }
  }

  updateUser() {
    if (this.editUserForm.invalid || !this.userId) return;
    this.userService.updateUser(this.userId, this.editUserForm.value).subscribe({
      next: (res: any) => {
        alert('Cập nhật người dùng thành công!');
        this.router.navigate(['/cms/users']);
      },
      error: (err) => {
        alert('Lỗi: ' + (err.error?.message || 'Không thể cập nhật'));
      }
    });
  }
}
