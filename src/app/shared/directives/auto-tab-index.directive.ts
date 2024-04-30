import { AfterViewInit, Directive, ElementRef, OnDestroy, Output, EventEmitter } from '@angular/core';

@Directive({
  selector: '[autotabindex]'
})
export class AutoTabIndexDirective implements AfterViewInit, OnDestroy {

  @Output() onComplete = new EventEmitter();

  private mutationObserver: MutationObserver;

  constructor(private hostEl: ElementRef) { }

  ngAfterViewInit(): void {
    this.applyIndexes();
    this.mutationObserver = new MutationObserver(() => this.applyIndexes());
    this.mutationObserver.observe(this.hostEl.nativeElement, {
      childList: true,
      subtree: true
    });
  }

  ngOnDestroy(): void {
    this.mutationObserver.disconnect();
  }

  private applyIndexes() {

    const isTabAheadOffset = !!this.hostEl.nativeElement.querySelector('[tabIndexAheadOffset]');
    // const elements = this.hostEl.nativeElement.querySelectorAll('[tabindex]');
    const elements = this.hostEl.nativeElement.querySelectorAll('input:not([type="hidden"]),mat-select,img[tabindex]');

    let globalOffset: number;
    let tabIndex: string;
    let tabControls = [];

    elements.forEach((el, index) => {
      if (isTabAheadOffset) {
        const offsetValue = parseInt(el.getAttribute('tabIndexAheadOffset'), 10);
        if (offsetValue) {
          globalOffset = offsetValue;
          tabIndex = this.getTabIndex(index + offsetValue + 1);
        } else if (globalOffset >= 1) {
          tabIndex = this.getTabIndex(index);
          globalOffset--;
        } else {
          tabIndex = this.getTabIndex(index + 1);
        }
      } else {
        tabIndex = this.getTabIndex(index + 1);
      }

      el.setAttribute('tabindex', tabIndex);
      let formcontrolname = el.getAttribute('formcontrolname');
      if( formcontrolname ){
        tabControls.push(formcontrolname);
      }
      
    });

    this.onComplete.emit(tabControls);
  }

  private getTabIndex(index: number): string {
    return index.toString();
  }
}
