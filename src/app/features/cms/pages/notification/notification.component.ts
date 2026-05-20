import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../services/notification.service';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/auth/services/auth.service';
import { FormErrorComponent } from '../../../../shared/components/form-error/form-error.component';


@Component({
  selector: 'app-notification.component',
  imports: [CommonModule,ReactiveFormsModule,FormErrorComponent],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationComponent {
  noti: any[] = [];
  private fb = inject(FormBuilder);
  notificationService = inject(NotificationService);
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);
  constructor() {
    this.getNoti();
  }
  createNotiForm = this.fb.group({
    type: ['SYSTEM_NOTIFICATION'],
    title: ['',[Validators.required]],
    content:  ['',[Validators.required]],
    targetType: ['SYSTEM'],
    targetId: [100],
    createdBy: [(this.authService.getUserInfo() as any)?.id || 1]
  });

  getNoti(){
    this.notificationService.getAllNotification().subscribe((res:any) => {
      this.noti = res.data ? res.data : res;
      this.cdr.markForCheck();
    });
  }
  sendNoti(){
    
    if (this.createNotiForm.invalid) {
      alert('Vui lòng điền đầy đủ thông tin');
      this.createNotiForm.markAllAsTouched();
      return; 
    }

    this.notificationService.sendNotification(this.createNotiForm.value).subscribe((res:any) => {
      this.getNoti();
      this.createNotiForm.reset({
        type: 'SYSTEM_NOTIFICATION',
        targetType: 'SYSTEM',
        targetId: 100,
        createdBy: (this.authService.getUserInfo() as any)?.id || 1,
        title: '',
        content: ''
      });
      this.cdr.markForCheck();
    });
  }
}
