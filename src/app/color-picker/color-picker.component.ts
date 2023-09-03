import { Component, ElementRef, EventEmitter, HostBinding, HostListener, Input, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatIconModule } from "@angular/material/icon";
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonToggleModule, MatButtonToggle, MatButtonToggleChange } from "@angular/material/button-toggle";
import { MatDividerModule } from "@angular/material/divider";
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";
import { HttpClientModule } from "@angular/common/http";
import { ColorPickerModule } from "ngx-color-picker";
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-color-picker',
  standalone: true,
  imports: [
    MatIconModule,
    MatSlideToggleModule,
    MatButtonToggleModule,
    MatDividerModule,
    HttpClientModule,
    ColorPickerModule,
    MatMenuModule,
  ],
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ColorPickerComponent {
  @ViewChild('popup') popup! : ElementRef<HTMLElement>
  @HostBinding('style.visibility') visibility = 'hidden';
  @HostBinding('style.left.px') left = 0;
  @HostBinding('style.top.px') top = 0;
  trigger : HTMLElement | undefined;
  toggle: boolean = false;
  @Input() selectedColor: string = '#0082f5';
  @Input() selectedWidth: string = "1";
  customColor: string = "#000000";
  @Input() title : string = "";
  posX : string = "";
  posY : string = "";

  @Output() ColorSelected : EventEmitter<string> = new EventEmitter<string>();
  @Output() WidthSelected : EventEmitter<string> = new EventEmitter<string>();
  constructor(private elementRef: ElementRef, private matIconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer){ 
    this.matIconRegistry.addSvgIcon(
      `color-wheel`,
      this.domSanitizer.bypassSecurityTrustResourceUrl(`/assets/colorwheel.svg`)
    );
  }
  colorPickerSelect(){
    this.selectedColor = this.customColor;
    this.ColorSelected.emit(this.selectedColor);
  }

  showPopup(event: Event) {
    const element = event.target as HTMLElement;
    this.trigger = element;
    const rect = element.getBoundingClientRect();
    var x = rect.left + rect.width /2 - 101;
    var y = rect.top -  250;
    this.posX = x + "px";
    this.posY = y + "px";
    this.left = x;
    this.top = y;
    if (this.visibility !== "visible") {
      this.visibility = "visible";
    }
    
  }

  onColorSelected(event: MatButtonToggleChange) {
    this.ColorSelected.emit(event.value);
  }

  onWidthSelected(event: MatButtonToggleChange) {
    this.WidthSelected.emit(event.value);
  }

}
