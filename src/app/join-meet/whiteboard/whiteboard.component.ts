import { Component, OnInit, AfterViewInit } from "@angular/core";
import { ScriptLoaderService } from "../../shared/script-loader.service";

@Component({
  selector: "app-whiteboard",
  templateUrl: "./whiteboard.component.html",
  styleUrls: ["./whiteboard.component.scss"],
})
export class WhiteboardComponent implements AfterViewInit {
  constructor(private Script: ScriptLoaderService) {}

  ngAfterViewInit(): void {
    this.fetchAllJs();
  }

  fetchAllJs() {
    this.Script.loadScripts("app-whiteboard", [
      "assets/js/js/param.js",
      // "assets/js/js/canvas-designer-widget.js",
      // "assets/js/js/widget.js",
      "assets/js/js/pdf.min.js",
    ]);
  }

  onPencilColorChanged(value: string) {
    (document.getElementById('pencil-fill-style') as HTMLSelectElement).value = value.substring(1);
    (document.getElementById("pencil-done") as HTMLButtonElement).click();
  }

  onPencilWidthChanged(value: string) {
    (document.getElementById('pencil-stroke-style') as HTMLSelectElement).value = value;
    (document.getElementById("pencil-done") as HTMLButtonElement).click();
  }

  onMarkerColorChanged(value: string) {
    (document.getElementById('marker-fill-style') as HTMLSelectElement).value = value.substring(1);
    (document.getElementById("marker-done") as HTMLButtonElement).click();
  }

  onMarkerWidthChanged(value: string){
    (document.getElementById('marker-stroke-style') as HTMLSelectElement).value = (+value * 3).toString();
    (document.getElementById("marker-done") as HTMLButtonElement).click();
  }
}
