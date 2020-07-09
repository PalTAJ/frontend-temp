import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DemoComponent } from './demo.component';

import {demoRouting, demoRoutingProviders} from './demo.routes';

@NgModule({
    imports: [
        CommonModule,
        demoRouting
    ],
    providers: [demoRoutingProviders],
    declarations: [DemoComponent]
})
export class DemoModule { }
