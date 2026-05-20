import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { RoleService } from '../../services/role.service';
import { PermissionService } from '../../services/permission.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-role.component',
  imports: [CommonModule, RouterLink],
  templateUrl: './role.component.html',
  styleUrl: './role.component.scss',
})
export class RoleComponent implements OnInit {
  public roleService = inject(RoleService);
  public permissionService = inject(PermissionService);
  public cdr = inject(ChangeDetectorRef);

  listRole: any[] = [];
  selectedRole: any = null;
  allPermissions: any[] = []; // Biến chứa tất cả các quyền gốc trên hệ thống
  entities: string[] = ['CHAMPION', 'ITEM', 'PERMISSION', 'ROLE', 'TRAIT', 'USER'];

  ngOnInit(): void {
    this.getAllRoles();
    this.getAllPermissions();
  }

  // Gọi API lấy TẤT CẢ các quyền gốc để dự phòng
  getAllPermissions() {
    this.permissionService.getAll().subscribe((res: any) => {
      this.allPermissions = res.data ? res.data : res;
    });
  }

  getAllRoles() {
    this.roleService.getAll().subscribe((res: any) => {
      const API = res.data ? res.data : res;
      this.listRole = API;
      this.cdr.markForCheck();
    });
  }
  selectRole(role: any) {
    this.selectedRole = role;
    this.cdr.markForCheck();
  }
  
  hasPermission(entity: string, action: string): boolean {
    if (!this.selectedRole) {
      return false;
    }

    const expectedCode = `${entity}_${action}`.toUpperCase();

    return this.selectedRole.permissions.some((item: any) => {
      if (item.code) return item.code.toUpperCase() === expectedCode;
      return false;
    });
  }


  togglePermission(entity: string, action: string, event: any) {
    if (!this.selectedRole) return;

    const isChecked = event.target.checked;
    const expectedCode = `${entity}_${action}`.toUpperCase();

    if (isChecked) {
      const realPermission = this.allPermissions.find(p => p.code && p.code.toUpperCase() === expectedCode);
      if (realPermission) {
        this.selectedRole.permissions.push(realPermission);
      } else {
        this.selectedRole.permissions.push({ code: expectedCode });
      }
    } else {
      this.selectedRole.permissions = this.selectedRole.permissions.filter((item: any) => {
        return item.code && item.code.toUpperCase() !== expectedCode;
      });
    }
  }

  saveRole() {
    if (!this.selectedRole) return;

    if (this.selectedRole.id === 1 || this.selectedRole.code === 'ADMIN') {
      alert('Lỗi: Hệ thống không cho phép cập nhật quyền của Administrator!');
      return;
    }

    const payload = {
      permissionIds: this.selectedRole.permissions
      .map((p: any) => p.id)
      .filter((id: any) => id != null)
    };

    // const permissionIds = [];

    // for (const permission of this.selectedRole.permissions) {
    //   if (permission.id != null) {
    //     permissionIds.push(permission.id);
    //   }
    // }

    this.roleService.updatePermissions(this.selectedRole.id, payload).subscribe({
      next: (res: any) => {
        alert('Cập nhật phân quyền thành công!');
      },
      error: (err) => {
        console.error(err);
        alert('Cập nhật thất bại: ' + (err.error?.message || err.message));
      }
    });
  }
  deleteRole(){
    if (this.selectedRole.id === 1 || this.selectedRole.code === 'ADMIN') {
      alert('Lỗi: Hệ thống không cho phép xóa vai trò của Administrator!');
      return;
    }
    this.roleService.delete(this.selectedRole.id).subscribe({
      next: (res: any) => {
        alert('Xóa thành công!');
        this.getAllRoles();
        this.selectRole(null);
      },
      error: (err: any) => {
        alert('Xóa thất bại: ' + (err?.error?.message || 'Lỗi hệ thống'));
      }
    });
  }
}
