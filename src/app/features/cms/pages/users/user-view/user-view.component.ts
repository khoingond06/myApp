import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-view.component',
  imports: [],
  templateUrl: './user-view.component.html',
  styleUrl: './user-view.component.scss',
})
export class UserViewComponent {
  private userService = inject(UserService);
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);
  userId: number | null = null;
  user: any = null;

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.userId = +params['id'];
      if (this.userId) {
        this.getUserById(this.userId);
      }
    });

  }
  getUserById(id: number) {
    this.userService.getUserById(id).subscribe((res: any) => {
      const data = res.data ? res.data : res;
      this.user = data;
      this.cdr.markForCheck();
    })
  }
}
