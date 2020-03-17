

import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import * as _ from 'lodash';
import { NotificationsService } from 'angular2-notifications';
import { AppDataLoader } from '../../../metabol.common/services';
import { AppSettings } from '../../../app/';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { ReactiveFormsModule } from '@angular/forms';

import { from, Subscription, BehaviorSubject } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { MatInputModule, MatFormFieldModule } from '@angular/material';


@Component({
  selector: 'analysis-search',
  templateUrl: './analysis-search.component.html',
  styleUrls: ['./analysis-search.component.css']
})



export class AnalysisSearchComponent implements OnInit {


  myControl = new FormControl();
  options: string[] = ['One', 'Two', 'Three'];
  filteredOptions: Observable<string[]>;



  form: FormGroup;
  form2: FormGroup;

  // metabol = FormControl ;
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

    this.loader.get('recon2', (recon) => {
      this.metabols = Object.keys(recon.metabolites).sort();
      this.pathways = Object.keys(recon.pathways).sort();


    });

    this.form2 = this.fb.group({
      metabol: ["", Validators.required],
    });


    this.filteredMetabols = this.form2.controls.metabol.valueChanges
      .pipe(map(val => val ? this.filter2(val).sort() : this.metabols.slice()));


    this.form = this.fb.group({
      pathway: ["", Validators.required],
      change: ["", Validators.required],
      Disease: [],
      qualifier: [],
      amount: []
    });

    this.filteredPathways = this.form.controls.pathway.valueChanges
      .pipe(map(val => val ? this.filter(val).sort() : this.pathways.slice()));


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

      .subscribe((data:any) => {

        let data3 = { 'pathway' : this.form.value.pathway};
        console.log(data);
        localStorage.setItem('search-results', JSON.stringify(data));
        // localStorage.setItem('search-metabol', JSON.stringify(data3));

        //
        this.router.navigate(['search-analysis-result']);

      });
  }



///////////////////////////////////////////

  filter2(val: string): string[] {
    return this.metabols.filter(option => new RegExp(`^${val}`, 'gi').test(option));
  }

  remove2(index) {
    this.metabolChanges.splice(index, 1);
  }

  add2(value) {
    this.metabolChanges.push(value);
    this.form2.reset();
  }


  searchMetabol() {
    let data2 = { 'metabol' : this.form2.value.metabol};
    // console.log(data2);

    this.httpClient.post(`${AppSettings.API_ENDPOINT}/analysis/search-by-metabol`, data2)
      .subscribe((data:any) => {
        console.log(data);

        // localStorage.setItem('search-metabol', JSON.stringify(data2));
        localStorage.setItem('search-results', JSON.stringify(data));
        //
        this.router.navigate(['search-analysis-result']);
      });
  }
}
