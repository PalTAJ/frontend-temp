import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import * as _ from 'lodash';

import { LoginService } from "../../../metabol.auth/services";
import { MetaboliteConcentration } from '../../models/metaboliteConcentration';
import { SubsystemAnalyzeService } from "../../services/subsystem-analyze/subsystem-analyze.service";
import { AppSettings } from '../../../app/';
import { NotificationsService } from 'angular2-notifications';
import { AppDataLoader } from '../../../metabol.common/services';
import {Observable} from 'rxjs';
import {startWith} from 'rxjs/operators';
import { HttpModule } from '@angular/http';
import {validate} from 'codelyzer/walkerFactory/walkerFn';
import { map } from 'rxjs/operators';

export interface Disease {
  id: number;
  name: string;
  synonym: string;
}

@Component({
  selector: 'concentration-table',
  templateUrl: 'concentration-table.component.html',
  styleUrls: ['concentration-table.component.css'],
  providers: [SubsystemAnalyzeService],
})
export class ConcentrationTableComponent implements OnInit {
  @Input() conTable: Array<[string, number]> = [];
  myControl = new FormControl();


  diseases: Disease[]= [];
  filteredOptions: Observable<Disease[]>;

  data;
  data2;
  data3;
  test: JSON;
  query: string;
  filteredDiseases=[];

  form: FormGroup;
  analyzeName: FormControl;
  isPublic: FormControl;
  selectedMethod = 0;
  analyzeEmail: FormControl;
  Disease: FormControl;
  selected = 'Combined.json';

  comboboxMethods: Array<object> = [
    { id: 0, name: "Metabolitics" },
    { id: 1, name: "Direct Pathway Mapping" }
    // { id: 2, name: "Pathway Enrichment"}
  ];
  methods = {
    Metabolitics: 0,
    DirectPathwayMapping: 1,
    MetaboliteEnrichment: 2
  };
  constructor(
    private fb: FormBuilder,
    private subSerivce: SubsystemAnalyzeService,
    private router: Router,
    private login: LoginService,
    private http: HttpClient,
    private notify: NotificationsService,
    private loader: AppDataLoader) { }

  ngOnInit() {
    this.form = this.createForm();
    this.analyzeName = new FormControl("My Analyze", Validators.required);
    this.isPublic = new FormControl(true, Validators.required);
    this.analyzeEmail = new FormControl("Email", Validators.required);
    this.Disease = new FormControl("Disease/Condition", Validators.required);
    this.fetchDiseases();
    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : (value.name + value.synonym)),
        map(name => name ? this._filter(name) : this.diseases.slice())
      );

  }
  fetchDiseases(){
        this.http.get(`${AppSettings.API_ENDPOINT}/diseases/all`, this.login.optionByAuthorization())

    // this.http.get(`http://127.0.0.1:5000/diseases/all`, this.login.optionByAuthorization())
    .subscribe((data: any) => {
      //console.log(data);
      data.forEach(element => {
        this.diseases.push({id: element['id'], name: element['name'], synonym: element['synonym']})
      });

      //this.diseases.push({name: 'abc', synonym:'x'})
    });
    // this.loader.get('diseases', (disease) => {
    //   let data = _.values<any>(disease);
    //   this.filteredDiseases = _.values<any>(data);
    //   console.log(_.values<any>(data));
    //   this.filteredDiseases.forEach(element => {
    //     this.diseases.push({name:element['name'], synonym: element['synonym'], id: element['name']});
    //   });
    // });
  }
  displayFn(disease?: Disease): string | undefined {
    return disease ? disease.name : undefined;
  }
  private _filter(name: string): Disease[] {
    const filterValue = name.toLowerCase();

    return this.diseases.filter(option => option.name.toLowerCase().indexOf(filterValue) === 0 || option.synonym.toLowerCase().indexOf(filterValue) ===0);
  }
  remove(index) {
    this.conTable.splice(index, 1);
  }

  createForm() {
    return this.fb.group({
      "name": ["", Validators.required],
      "value": ["", Validators.pattern('[0-9]+(\\.[0-9]+)?')]
    });
  }

  onSubmit(value) {
    // this.conTable.push([value['name'], parseInt(value['value'])]);
    // this.form = this.createForm();
    let file = this.selected;
    this.subSerivce.getJSON(file).subscribe(data => {
      this.data2 = data[value['name']];

      if (this.data2 === null || this.data2 === undefined || this.data2 === "" || this.data2.lenght === 0) {
        this.notify.error('Adding metabolite Failed', 'Check if you chosen the right DB ');

      } else {
        this.conTable.push([data[value['name']], value['value']]);
        this.form = this.createForm();
        this.notify.info('Metabolite Added', ' Sucess');
      }

    });
  }

  analyze() {
    const selectedMethod = this.selectedMethod;

    let data = {}
    if(localStorage.getItem('isMultiple') == 'True'){
        // assign the data came from API as data

    }
    else{
      let name = this.analyzeName.value;



      if (this.login.isLoggedIn()){
      data = {
        "study_name": this.analyzeName.value,
        "public": this.isPublic.value,
        "analysis": { [name] : { "Metabolites": _.fromPairs(this.conTable), "Label": "not_provided"}},
        "group": "not_provided",
        "disease":this.myControl.value["id"]
      };
    }  // if


    else{
      data = {
        "study_name": this.analyzeName.value,
        "public": this.isPublic.value,
        "analysis": { [name] : { "Metabolites": _.fromPairs(this.conTable), "Label": "not_provided"}},
        "group": "not_provided",
        "disease":this.myControl.value["id"],
        "email":this.analyzeEmail.value
      };
    } // inner else


    }  // else

    // console.log(data);


    if (selectedMethod === this.methods.Metabolitics) {
      this.metabolitics(data);
    }
    else if(selectedMethod === this.methods.DirectPathwayMapping) {
      this.directPathwayMapping(data);
    }
    else if(selectedMethod === this.methods.MetaboliteEnrichment){
      this.metaboliteEnrichment(data);
    }
  }


  metabolitics(data) {

    if (this.login.isLoggedIn()){

    this.http.post(`${AppSettings.API_ENDPOINT}/analysis/fva`,
      data, this.login.optionByAuthorization())
      .subscribe((data: any) => {
        this.notify.info('Analysis Start', 'Analysis in progress');
        this.router.navigate(['/past-analysis', data['id']]);
      },
        error => {
          this.notify.error('Analysis Fail', error);
        });
  } // if
  else{
    this.http.post(`${AppSettings.API_ENDPOINT}/analysis/fva/public`,
      data)
      .subscribe((data: any) => {
        this.notify.info('Analysis Start', 'Results will be sent by email.');
        this.router.navigate(['/search']);
      },
        error => {
          this.notify.error('Analysis Fail', error);
        });

        // this.router.navigate(['/search']);

  }//else


  }



  directPathwayMapping(data) {

    if (this.login.isLoggedIn()){
      this.http.post(`${AppSettings.API_ENDPOINT}/analysis/direct-pathway-mapping`,
         data, this.login.optionByAuthorization())
         .subscribe((data:any) => {
           this.notify.info('Analysis Start', 'Analysis in progress');
           this.notify.success('Analysis Done', 'Analysis is successfully done');
           this.router.navigate(['/past-analysis', data['id']]);
         },
         error => {
         this.notify.error('Analysis Fail', error);
      });

    localStorage.setItem('search-results', JSON.stringify(data));
    } // if
else{
  this.http.post(`${AppSettings.API_ENDPOINT}/analysis/direct-pathway-mapping/public`,
  data, this.login.optionByAuthorization())
  .subscribe((data:any) => {
    this.notify.info('Analysis Start', 'Analysis in progress');
    this.notify.success('Analysis Done', 'Analysis Results sent to your email');
    this.router.navigate(['/search']);
      },
  error => {
  this.notify.error('Analysis Fail', error);
});

localStorage.setItem('search-results', JSON.stringify(data));
    // this.router.navigate(['/search']);

}// else

  }




  metaboliteEnrichment(data){
    this.http.post(`http://127.0.0.1:5000/analysis/metabolite-enrichment`,
         data, this.login.optionByAuthorization())
         .subscribe((data:any) => {
           // console.log(data);
           this.notify.info('Analysis Start', 'Analysis in progress');
           this.notify.success('Analysis Done', 'Analysis is successfully done');
           this.router.navigate(['/past-analysis', data['id']]);
         },
         error => {
         this.notify.error('Analysis Fail', error);
      });
    localStorage.setItem('search-results', JSON.stringify(data));
  }
}
