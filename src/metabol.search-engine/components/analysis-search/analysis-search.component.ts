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

  metabol ;
  changeM = '0';
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

    this.form = this.fb.group({
      pathway: ["", Validators.required],
      change: ["", Validators.required],
      Disease: [],
      qualifier: [],
      amount: []
    });


    this.form2 = this.fb.group({
      metabol: ["", Validators.required],
      changeM: ["", Validators.required],
      DiseaseM: [],
      qualifierM: [],
      amountM: []
    });


    this.filteredPathways = this.form.controls.pathway.valueChanges
    //.startWith(null)
      .pipe(map(val => val ? this.filter(val).sort() : this.pathways.slice()));


  //   this.filteredMetabols = this.form.controls.metabols
  //     .pipe(map(val => val ? this.filter(val).sort() : this.metabols.slice()));
  //
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
    // this.httpClient.post(`${AppSettings.API_ENDPOINT}/analysis/search-by-change`, this.pathwayChanges)
    this.httpClient.post(`http://127.0.0.1:5000/analysis/search-by-change`, this.pathwayChanges)

      .subscribe((data:any) => {
        localStorage.setItem('search-results', JSON.stringify(data));
        this.router.navigate(['past-analysis']);
      });
  }


  /////////////////



filter2(val: string): string[] {
  return this.metabols.filter(option => new RegExp(`^${val}`, 'gi').test(option));
}

remove2(index) {
  this.metabolChanges.splice(index, 1);
}

add2(value) {
  this.metabolChanges.push(value);
  this.form.reset();
}


searchMB() {
    this.httpClient.post('http://127.0.0.1:5000/metabol-searh',{
      name: this.metabol.value, change : this.changeM , qualifier : this.qualifierM, amount : this.amount2, dis : this.Disease2 }).subscribe(data => {
        // this.recData = data as JSON;
        // this.idData = JSON.parse(this.recData[1]);
        // this.conTable = this.idData
        // localStorage.removeItem('search-metabol');

        localStorage.setItem('search-m2', JSON.stringify(data));
        console.log(data);
        this.router.navigate(['past-analysis-metabols']);

      },
      err => {
        console.log("Error occured");
      }
    );
    console.log(this.metabol.value);
  }
  //////////////////

}
