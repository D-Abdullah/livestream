import { NgModule } from "@angular/core";
import { TransformNumberPipe } from "./transform-number.pipe";

@NgModule({
    imports: [],
    declarations: [TransformNumberPipe],
    exports: [TransformNumberPipe]
})
export class TransformNumberModule { }