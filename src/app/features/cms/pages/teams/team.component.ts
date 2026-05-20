import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeamService } from '../../services/team.service';
import { FormsModule } from '@angular/forms';
import { PaginationComponent } from "../../../../shared/components/pagination/pagination.component";
import { RouterLink } from '@angular/router';
import { CmsService } from '../../services/cms.service';

@Component({
  selector: 'app-team.component',
  imports: [CommonModule, FormsModule, PaginationComponent, RouterLink],
  templateUrl: './team.component.html',
  styleUrl: './team.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TeamComponent {
  teamService = inject(TeamService);
  private cdr = inject(ChangeDetectorRef);
  private cmsService = inject(CmsService);

  team: any[] = [];
  page: number = 0;
  size: number = 10;
  totalPages: number = 0;
  totalElements: number = 0;
  keyword: string = '';
  showFilterModal: boolean = false;
  selectedIds = new Set<number>();
  filterset: string = '';

  sets: any[] = [];
  selectedTags: string[] = [];
  selectedTier:string[] = [];
  filterStatus: string = 'All';
  tempFilterStatus: string = 'All'; 
  filterCompStatus: string = 'All';
  tempFilterCompStatus: string = 'All';


  ngOnInit() {
    this.getTeams()
    this.getSets();
  }
  getTeams(){
    this.teamService.getTeam(this.page, this.size, this.keyword,this.filterset,this.filterStatus,this.filterCompStatus,this.selectedTags,this.selectedTier).subscribe((res: any) => {
      const apiData = res.data ? res.data : res;
      this.team = apiData.content || apiData;
      this.totalPages = apiData.totalPages || 0;
      this.totalElements = apiData.totalElements || 0;
      this.cdr.markForCheck();
    })
  }
  getSets(){
    this.cmsService.getSets(this.page, this.size, this.keyword).subscribe((res: any) => {
      const apiData = res.data ? res.data : res;
      this.sets = apiData.content || apiData;
      this.cdr.markForCheck();
    })
  }
  searchData(){
    this.page = 0;
    this.getTeams();
  }

  onCheckboxChange(event: any) {
    const value = event.target.value;
    const checked = event.target.checked;

    if (checked) {
      this.selectedTags.push(value);
    } else {
      this.selectedTags = this.selectedTags.filter(v => v !== value);
    }

  }
  onchecktier(event: any){
    const value = event.target.value;
    const checked = event.target.checked;
    if (checked) {
      this.selectedTier.push(value);
    } else {
      this.selectedTier = this.selectedTier.filter(v => v !== value);
    }
    
  }
  openFilterModal() {
    this.tempFilterCompStatus = this.filterCompStatus;
    this.tempFilterStatus = this.filterStatus;
    this.showFilterModal = true;
    this.cdr.markForCheck();
  }

  closeFilterModal() {
    this.showFilterModal = false;
    this.cdr.markForCheck();
  }
  applyFilter(){
    this.filterCompStatus = this.tempFilterCompStatus;
    this.filterStatus = this.tempFilterStatus;
    this.selectedTags;
    this.applyFilter;
    this.page = 0;
    this.getTeams();
  }

  isAllSelected() {
    return this.team.length > 0 && this.team.every(set => this.selectedIds.has(set.id));
  }

  toggleAllSelection() {
    if (this.isAllSelected()) {
      this.team.forEach(set => this.selectedIds.delete(set.id));
    } else {
      this.team.forEach(set => this.selectedIds.add(set.id));
    }
    this.cdr.markForCheck();
  }
  toggleSelection(id: number) {
    if (this.selectedIds.has(id)) {
      this.selectedIds.delete(id);
    } else {
      this.selectedIds.add(id);
    }
    this.cdr.markForCheck();
  }
  deleteSelected() {
    if (this.selectedIds.size === 0) return;

    if (confirm(`Bạn có chắc chắn muốn xóa ${this.selectedIds.size} mục đã chọn?`)) {
      const idsToDelete = Array.from(this.selectedIds);
      this.selectedIds.clear();
      this.cdr.markForCheck();

      this.teamService.deleteTeams(idsToDelete).subscribe({
        next: (res: any) => {
          if (res && res.success === false) {
            alert('Có lỗi xảy ra: ' + (res.message || 'Lỗi khi xóa'));
          } else {
            this.team = this.team.map(team => 
              idsToDelete.includes(team.id) ? { ...team, deleted: true } : team
            );
            this.cdr.markForCheck();
          }
          this.getTeams();
        },
        error: (err: any) => {
          alert('Có lỗi xảy ra: ' + (err?.error?.message || 'Lỗi hệ thống'));
          this.getTeams();
        }
      });
    }
  }
  changePage = (page: number) => {
    if (page < 0) {
      this.page = 0;
    } else if (page >= this.totalPages) {
      this.page = this.totalPages - 1;
    } else {
      this.page = page;
    }
    if (this.page < 0) this.page = 0;

    this.getTeams();
    this.cdr.markForCheck();
  }

  changePageSize = (pageSize: number) => {
    this.size = pageSize;
    this.page = 0;
    this.getTeams();
    this.cdr.markForCheck();
  }
}
