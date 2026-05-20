import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl } from '@angular/forms';
import { VALIDATION_MESSAGES } from '../../../core/utils/validation-messages';

@Component({
  selector: 'app-form-error',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="error-msg" *ngIf="shouldShowErrors()">
      {{ getErrorMessage() }}
    </div>
  `,
  styles: [`
    .error-msg {
      color: #dc3545;
      font-size: 13px;
      margin-top: 4px;
    }
  `]
})
export class FormErrorComponent {
  @Input() control!: AbstractControl | null;
  @Input() customMessages: { [key: string]: string } = {};

  // Hàm kiểm tra xem có nên hiển thị lỗi không
  shouldShowErrors(): boolean {
    return !!this.control && this.control.invalid && (this.control.dirty || this.control.touched);
  }

  // Hàm lấy ra thông báo lỗi tương ứng với validation lỗi đầu tiên mắc phải
  getErrorMessage(): string {
    if (!this.control || !this.control.errors) {
      return '';
    }

    // Lấy key lỗi đầu tiên bị vướng (vd: 'required', 'minlength'...)
    const firstErrorKey = Object.keys(this.control.errors)[0];
    
    // Nếu có truyền vào message ưu tiên từ bên ngoài thì dùng nó
    if (this.customMessages && this.customMessages[firstErrorKey]) {
      return this.customMessages[firstErrorKey];
    }

    // Trích xuất thông báo chung từ file Utils
    const messageOrFn = VALIDATION_MESSAGES[firstErrorKey];
    
    if (typeof messageOrFn === 'function') {
      return messageOrFn(this.control.errors[firstErrorKey]);
    }
    
    if (typeof messageOrFn === 'string') {
      return messageOrFn;
    }

    return 'Trường này không hợp lệ';
  }
}
