import { Component, OnInit } from '@angular/core';
import {ConcentrationTableComponent} from '../concentration-table/concentration-table.component';
import {MetaboliteConcentration} from '../../models/metaboliteConcentration';
import { LoginService } from "../../../metabol.auth/services";
import {SignupService} from '../../../metabol.auth/services/signup/signup.service';
import {Router} from '@angular/router';
import {FormBuilder} from '@angular/forms';
import {MatDialog, MatDialogRef} from '@angular/material';
import {MatDialogModule} from '@angular/material/dialog';
import {Subject} from 'rxjs/Subject';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NotificationsService } from 'angular2-notifications';
import { AppDataLoader } from '../../../metabol.common/services';
import { HttpClient } from '@angular/common/http';
import { SubsystemAnalyzeService } from "../../services/subsystem-analyze/subsystem-analyze.service";




import { Http, Headers, Response, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/toPromise';


@Component({
  selector: 'app-manual',
  templateUrl: 'excel.component.html',
  styleUrls: ['excel.component.css'],
  providers: [SubsystemAnalyzeService],
})
export class ExcelComponent implements OnInit {


  usersData;
  usersData2;
  usersData3 = [];
  // keyys = []
  cases=[];
  labels=[];
  metaboliteNames=[];



  data;
  data2;
  data3;
  test: JSON;
  diseases;
  query: string;
  filteredDiseases=[];






  usersForm: FormGroup;

  form: FormGroup;
  analyzeName: FormControl;
  isPublic: FormControl;
  selectedMethod = 0;
  analyzeEmail: FormControl;
  Disease: FormControl;
  selected = 'Combined.json';


  comboboxMethods: Array<object> = [
    { id: 0, name: "Metabolitics" },
    { id: 1, name: "Direct Pathway Mapping" },
  ];
  methods = {
    Metabolitics: 0,
    DirectPathwayMapping: 1,
  };



  constructor(

    private fb: FormBuilder,
    private router: Router,
    private login: LoginService,
    private http: HttpClient,
    private notify: NotificationsService,
    // private http: Http,
    private loader: AppDataLoader
    ) {





  }

  ngOnInit(){


    this.form = this.createForm();
    this.analyzeName = new FormControl("My Analyze", Validators.required);
    this.isPublic = new FormControl(true, Validators.required);
    this.analyzeEmail = new FormControl("Email", Validators.required); //Disease
    this.Disease = new FormControl("Disease/Condition", Validators.required);
    this.fetchDiseases()



    // this.selected = "option2";
    this.usersData = JSON.parse(localStorage.getItem('metabolitics-data'));
    this.usersData2 = this.usersData;
    for(let name in this.usersData2['analysis']){
      this.cases.push(name);
      this.labels.push(this.usersData2['analysis'][name]['Label']);
      // this.metaboliteValues.push(Object.entries(this.usersData2['analysis'][name]['Metabolites']));
    }
    for(let key in this.usersData2['analysis'][this.cases[0]]["Metabolites"]) {
    this.metaboliteNames.push(key); 
  }

  
  for (var _i = 0; _i < this.metaboliteNames.length; _i++) {
    let temp_list = new Array();
    let temp_metabol_name;
    for (var _j = 0; _j < this.cases.length; _j++) {
      temp_metabol_name = this.metaboliteNames[_i];
      temp_list.push(this.usersData2['analysis'][this.cases[_j]]["Metabolites"][this.metaboliteNames[_i]]);
    }
    temp_list.unshift(temp_metabol_name);
    this.usersData3.push(temp_list);

}

// console.log(this.usersData3);



// console.log(this.usersData2);
// console.log(this.cases);
// console.log(this.metaboliteNames);



  localStorage.removeItem('metabolitics-data');


  }

    onSubmit() {
      console.log("Analyse under Construction")

  

}


createForm() {
  return this.fb.group({
    "name": ["", Validators.required],
    "value": ["", Validators.pattern('[0-9]+(\\.[0-9]+)?')]
  });
}


fetchDiseases(){
  this.http.get(`http://127.0.0.1:5000/diseases/all`, this.login.optionByAuthorization())
  .subscribe((data: any) => {
    this.diseases = data;
  });
}

  analyze(){
    console.log("Analyse under Construction")
    // this.router.navigateByUrl('/past-analysis-multi/123');

    const selectedMethod = this.selectedMethod;

      
    this.usersData2['public'] = this.isPublic.value;
    if (selectedMethod === this.methods.Metabolitics) {
      this.metabolitics(this.usersData2);
    }
    else if(selectedMethod === this.methods.DirectPathwayMapping) {
      this.directPathwayMapping(this.usersData2);
    }

  }


  metabolitics(data) {
    console.log("Running...");

    // this.http.post(`${AppSettings.API_ENDPOINT}/analysis/fva`,
    this.http.post(`http://127.0.0.1:5000/analysis/fva`,
      data, this.login.optionByAuthorization())
      .subscribe((data: any) => {
        this.notify.info('Analysis Start', 'Analysis in progress');
        this.router.navigate(['/past-analysis', data['id']]);
      },
        error => {
          this.notify.error('Analysis Fail', error);
        });
  }

  directPathwayMapping(data) {
     console.log("Running...");
     this.http.post(`http://127.0.0.1:5000/analysis/direct-pathway-mapping`,
         data, this.login.optionByAuthorization())
         .subscribe((data:any) => {
           console.log(data);
           this.notify.info('Analysis Start', 'Analysis in progress');
           this.notify.success('Analysis Done', 'Analysis is successfully done');
           this.router.navigate(['/past-analysis', data['id']]);
         },
         error => {
         this.notify.error('Analysis Fail', error);
      });



    // data['results_pathway'] = [this.scorePathways(data['concentration_changes'])];
    // data['results_reaction'] = [this.scoreReactions(data['concentration_changes'])];
    // data['results_metabolite'] = [data['concentration_changes']];
    localStorage.setItem('search-results', JSON.stringify(data));
    // localStorage.setItem('histogram', JSON.stringify(pathwayScores));
    // this.router.navigate(['/past-analysis', 'direct-pathway-mapping']);
  }


  }


