import { AfterViewInit, Directive, ElementRef, Input, SimpleChanges } from '@angular/core';
@Directive({
  selector: "[text-direction-detect]",
})
export class TextDirectionDirective implements AfterViewInit {


  @Input('text_el') text_el = '';
  nativeElement: HTMLElement;
  constructor(private el: ElementRef) {

  }
  ngAfterViewInit() {
    this.nativeElement = this.el.nativeElement;
    // this.fromat()
  }
  ngOnChanges(changes: SimpleChanges): void {
    // //console.log(this.text_el)
    this.fromat()
  }
  fromat() {
    let x = new RegExp("[\x00-\x80]+"); // is ascii
    
    let isAscii = x.test(this.text_el?.charAt(0));


    if (this.nativeElement) {
      if (isAscii) {
        this.nativeElement.style.direction = 'ltr'
      }
      else {
        this.nativeElement.style.direction = 'rtl'
      }
    }

  }
}
