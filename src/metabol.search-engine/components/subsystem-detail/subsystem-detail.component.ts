import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Compiler } from '@angular/core';


import { Router } from '@angular/router';

import { AppDataLoader } from '../../../metabol.common/services';
import * as _ from 'lodash';

@Component({
  selector: 'app-subsystem-detail',
  templateUrl: 'subsystem-detail.component.html',
  styleUrls: ['subsystem-detail.component.css'],
})
export class SubsystemDetailComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private loader: AppDataLoader,
    private router: Router,
    private _compiler: Compiler
        ) { }

  pathway: string;
  reactions: any[];
  connectedSubsystems: string[];

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.loader.get('recon2', (recon) => {
        this.pathway = decodeURIComponent(params['id']);
        this.reactions = recon.pathways[this.pathway].map(x => recon.reactions[x]);
        // this.router.navigate(['/subsystem/detail/',this.pathway]);
        // this.router.navigateByUrl('/subsystem/detail/'+this.pathway)
        

      });
    });
  }
  

}
