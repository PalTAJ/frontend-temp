import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {DemoComponent} from './demo.component';

const demoRoutes: Routes = [
    { path: 'demo', component: DemoComponent },
];

export const demoRoutingProviders: any[] = [];

export const demoRouting: ModuleWithProviders = RouterModule.forRoot(demoRoutes);
