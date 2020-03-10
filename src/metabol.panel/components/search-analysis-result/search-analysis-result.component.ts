
import { Component, OnInit, Input, OnChanges } from '@angular/core';

import { MatDialog, MatDialogRef } from '@angular/material';
import { DialogPathwayVisualizationComponent } from '../dialog-pathway-visualization';
import { DialogReactionResultsComponent } from '../dialog-reaction-results';
import * as _ from 'lodash';

import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { map } from "rxjs/operators";
import { AppSettings } from "../../../app";
import { LoginService } from "../../../metabol.auth/services";
import {MatListModule} from '@angular/material/list';


@Component({
  selector: 'search-analysis-result',
  templateUrl: './search-analysis-result.component.html',
  styleUrls: ['./search-analysis-result.component.css']
})
export class SearchAnalysisResultComponent implements OnInit, OnChanges {

  // data = { list: [], disease: [], public: [], results: [] };
  searchResults;
  metabol;


  // @Input() data;
  tableData;

  // analysisNames: Array<string>;
  // columns;

  constructor(private dialog: MatDialog,
  private http: HttpClient,
  private fb: FormBuilder,
  private login: LoginService,
  private actRoute: ActivatedRoute,
  private router: Router) { }

  ngOnInit() {
    const data  = localStorage.getItem('search-results');
    const data2  = localStorage.getItem('search-metabol');
    this.searchResults = JSON.parse(data);
    this.metabol = JSON.parse(data2);


    console.log(this.searchResults);
    // for (let i of this.searchResults) {
    //   console.log(i);
    // }
    if (this.searchResults && this.metabol) {
      // this.data.results = searchResults;
      localStorage.removeItem('search-results');
      localStorage.removeItem('search-metabol');

    }

  }

  ngOnChanges() {



  }

}
