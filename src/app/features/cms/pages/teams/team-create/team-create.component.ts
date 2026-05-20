import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TeamService } from '../../../services/team.service';
import { CmsService } from '../../../services/cms.service';

@Component({
  selector: 'app-team-create.component',
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './team-create.component.html',
  styleUrl: './team-create.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TeamCreateComponent implements OnInit {
  private fb = inject(FormBuilder);
  private teamService = inject(TeamService);
  private router = inject(Router);
  private cmsService = inject(CmsService);
  private cdr = inject(ChangeDetectorRef);

  sets: any[] = [];
  champions: any[] = [];
  selectedChampionIds: number[] = [];

  tiers: string[] = ['Common', 'Rare', 'Epic', 'Legendary', 'Radiant'];
  styles: string[] = ['Aggressive', 'Defensive', 'Balanced', 'Control', 'Rush'];

  teamForm: FormGroup = this.fb.group({
    name: [''],
    tier: [''],
    style: [''],
    setId: [''],
    championIds: [[]],
  });


  ngOnInit() {
    this.getData();

    this.teamForm.get('setId')?.valueChanges.subscribe((setId: any) => {
      this.champions = [];
      this.selectedChampionIds = [];
      this.teamForm.patchValue({
         championIds: [] 
        });


      if (setId) {
        this.cmsService.getChampionsBySetId(setId).subscribe({
          next: (res: any) => {
            // const raw = res.data ? res.data : res;
            // const list: any[] = Array.isArray(raw) ? raw : (raw.content || []);
            // this.champions = list.filter((c: any) => c.name?.trim());
            const data = res.data ? res.data : res;
            this.champions = data || [];
            this.cdr.markForCheck();
          }
        });
      }
    });
  }
  getData(){
    this.cmsService.getSets(0, 100).subscribe({
      next: (res: any) => {
        const apiData = res.data ? res.data : res;
        this.sets = apiData.content || [];
        this.cdr.markForCheck();
      }
    });
  }

  toggleChampion(id: number, checked: boolean) {
   if (checked) {
    this.selectedChampionIds.push(id);
  } else {
    this.selectedChampionIds =
      this.selectedChampionIds.filter(i => i !== id);
  }

  this.teamForm.patchValue({
    championIds: this.selectedChampionIds
  });
  }

  isSelected(id: number): boolean {
    return this.selectedChampionIds.includes(id);
  }

  onSubmit() {
    if (this.selectedChampionIds.length === 0) {
      alert('Vui lòng chọn ít nhất một champion!');
      return;
    }

    const payload = this.teamForm.value;
    this.teamService.createTeam(payload).subscribe({
      next: (res: any) => {
        if (res.success !== false) {
          alert('Thêm đội thành công!');
          this.router.navigate(['/cms/teams']);
        } else {
          alert('Có lỗi xảy ra: ' + res.message);
        }
      },
      error: (err: any) => {
        alert('Có lỗi xảy ra: ' + (err?.error?.message || 'Lỗi hệ thống'));
      }
    });
  }
}
