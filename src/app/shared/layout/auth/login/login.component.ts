import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/auth/services/auth.service';
import { APP_ROUTES } from '../../../../core/constants/app-routes.constants';



@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  error: string | null = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.loginForm = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    });
  }

  login() {
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.error = null;

    const { username, password } = this.loginForm.value;

    this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        console.log('Dữ liệu API trả về:', response.data);
        this.loading = false;

        const userInfo = response.data.user || { username: username };

        this.authService.saveToken(
          response.data.accessToken, 
          response.data.refreshToken, 
          userInfo
        );
        this.cdr.markForCheck();
        this.router.navigate([APP_ROUTES.BRANK]);
      },
      error: () => {
        this.error = 'Tên đăng nhập hoặc mật khẩu không chính xác!';
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }
}
