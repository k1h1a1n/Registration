import { Component, Input, inject } from '@angular/core';
import { PreLoadingService } from '../../services/pre-loading.service';

@Component({
  selector: 'app-pre-loading-msg',
  templateUrl: './pre-loading-msg.component.html',
  styleUrl: './pre-loading-msg.component.scss'
})
export class PreLoadingMsgComponent {
  @Input() customMessage: string = 'Loading...';
  loading: boolean = false;
  private  loadingService = inject(PreLoadingService);
  ngOnInit(): void {
    this.loadingService.loading$.subscribe((loading) => {
      this.loading = loading;
    });
  }
}
