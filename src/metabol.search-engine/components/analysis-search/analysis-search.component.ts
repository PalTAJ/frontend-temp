// import { Component, OnInit, Input } from '@angular/core';
// import { Router } from '@angular/router';
// import { HttpClient } from '@angular/common/http';
// import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
// import {MatAutocompleteModule} from '@angular/material/autocomplete';
// import * as _ from 'lodash';
// import { NotificationsService } from 'angular2-notifications';
//
// import { AppDataLoader } from '../../../metabol.common/services';
// import { AppSettings } from '../../../app/';
// import { map } from "rxjs/operators";
//
// @Component({
//   selector: 'analysis-search',
//   templateUrl: './analysis-search.component.html',
//   styleUrls: ['./analysis-search.component.css']
// })
// export class AnalysisSearchComponent implements OnInit {
//
//   form: FormGroup;
//
//   pathways;
//   filteredPathways;
//
//   pathwayChanges = [];
//
//   constructor(
//     private fb: FormBuilder,
//     private http: HttpClient,
//     private router: Router,
//     private loader: AppDataLoader) { }
//
//   ngOnInit() {
//
//     this.loader.get('recon2', (recon) => {
//       this.pathways = Object.keys(recon.pathways).sort();
//     });
//
//     this.form = this.fb.group({
//       pathway: ["", Validators.required],
//       change: ["", Validators.required],
//       qualifier: [],
//       amount: []
//     });
//
//     this.filteredPathways = this.form.controls.pathway.valueChanges
//       //.startWith(null)
//       .pipe(map(val => val ? this.filter(val).sort() : this.pathways.slice()));
//   }
//
//   filter(val: string): string[] {
//     return this.pathways.filter(option => new RegExp(`^${val}`, 'gi').test(option));
//   }
//
//   remove(index) {
//     this.pathwayChanges.splice(index, 1);
//   }
//
//   add(value) {
//     this.pathwayChanges.push(value);
//     this.form.reset();
//   }
//
//   search() {
//     this.http.post(`${AppSettings.API_ENDPOINT}/analysis/search-by-change`, this.pathwayChanges)
//       .subscribe((data:any) => {
//         localStorage.setItem('search-results', JSON.stringify(data));
//         this.router.navigate(['past-analysis']);
//       });
//   }
//
// }
// ##############################

import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import * as _ from 'lodash';
import { NotificationsService } from 'angular2-notifications';
import { AppDataLoader } from '../../../metabol.common/services';
import { AppSettings } from '../../../app/';
import { map } from "rxjs/operators";

@Component({
  selector: 'analysis-search',
  templateUrl: './analysis-search.component.html',
  styleUrls: ['./analysis-search.component.css']
})
export class AnalysisSearchComponent implements OnInit {

  form: FormGroup;
  form2: FormGroup;

  metabol = FormControl ;
  changeM = FormControl;
  qualifierM = 'none';
  amount2 = ' Diff Amount';
  Disease2 = 'Disease / Physiological Condition';
  metabols;
  pathways;
  Disease ;
  filteredPathways;
  filteredMetabols;

  pathwayChanges = [];
  metabolChanges = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private loader: AppDataLoader,
    private httpClient: HttpClient) { }

  ngOnInit() {

    // this.metabol = new FormControl("Metabol", Validators.required)
    this.loader.get('recon2', (recon) => {
      this.metabols = Object.keys(recon.metabolites).sort();

    });
    this.loader.get('recon2', (recon) => {
      this.pathways = Object.keys(recon.pathways).sort();
    });
    // console.log(this.pathways);
    // console.log(this.metabols);
    this.form = this.fb.group({
      pathway: ["", Validators.required],
      change: ["", Validators.required],
      Disease: [],
      qualifier: [],
      amount: []
    });


    this.form2 = this.fb.group({
      metabol: ["", Validators.required],
      // changeM: ["", Validators.required],
    });


    this.filteredPathways = this.form.controls.pathway.valueChanges
    //.startWith(null)
      .pipe(map(val => val ? this.filter(val).sort() : this.pathways.slice()));
    // this.filteredMetabols = this.form2.controls.metabol.valueChanges
      // .pipe(map(val => val ? this.filterMetabols(val).sort() : this.metabols.slice()));
  }

  filter(val: string): string[] {
    return this.pathways.filter(option => new RegExp(`^${val}`, 'gi').test(option));
  }

  remove(index) {
    this.pathwayChanges.splice(index, 1);
  }

  add(value) {
    this.pathwayChanges.push(value);
    this.form.reset();
  }

  search() {
    this.httpClient.post(`${AppSettings.API_ENDPOINT}/analysis/search-by-change`, this.pathwayChanges)
    // this.httpClient.post(`http://127.0.0.1:5000/analysis/search-by-change`, this.pathwayChanges)

      .subscribe((data:any) => {
        console.log(data);
        localStorage.setItem('search-results', JSON.stringify(data));
        this.router.navigate(['past-analysis']);
      });
  }

  // filterMetabols(val: string): string[] {
  //   console.log(this.filteredMetabols);

  //   return this.metabols.filter(option => new RegExp(`^${val}`, 'gi').test(option));
  // }

  // removeMetabol(index) {
  //   this.metabolChanges.splice(index, 1);
  // }

  // addMetabol(value) {
  //   this.metabolChanges.push(value);
  //   // this.form2.reset();
  // }

  searchMetabol() {
    let data2 = { "metabol" : this.form2.value.metabol};
    // console.log(data2);

    this.httpClient.post(`${AppSettings.API_ENDPOINT}/analysis/search-by-metabol`, data2)
      .subscribe((data:any) => {
        // console.log(data);

        // localStorage.setItem('search-results', JSON.stringify(data));
        localStorage.setItem('search-metabol', JSON.stringify(data2));

        localStorage.setItem('search-results', JSON.stringify(data));

        this.router.navigate(['search-analysis-result']);
      });
  }
}
