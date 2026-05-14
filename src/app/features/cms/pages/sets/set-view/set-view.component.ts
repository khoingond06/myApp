import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CmsService } from '../../../services/cms.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-set-view.component',
  imports: [CommonModule],
  templateUrl: './set-view.component.html',
  styleUrl: './set-view.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SetViewComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private cmsService = inject(CmsService);
  set: any = null;
  private cdr = inject(ChangeDetectorRef);

  setId: number | null = null;

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.setId = +params['id'];
      if (this.setId) {
        this.getData(this.setId);
      }
    });
  }
  getData(id: number) :void {
    this.cmsService.getSetById(id).subscribe((res: any) => {
      const apiData = res.data ? res.data : res;
      this.set = apiData;
      this.cdr.markForCheck();
    });  
  }

}
