import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { map } from "rxjs/operators";
import { AppSettings } from "../../../app";
import { LoginService } from "../../../metabol.auth/services";
import * as _ from 'lodash';


@Component({
  selector: 'app-past-analysis',
  templateUrl: './past-analysis.component.html',
  styleUrls: ['./past-analysis.component.css']
})
export class PastAnalysisComponent implements OnInit {
  data = { list: [], disease: [], public: [], results: []};
  form = new FormGroup({});

  temp: any = [];


  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private login: LoginService,
    private actRoute: ActivatedRoute,
    private router: Router) {
    }

  ngOnInit() {


    let isActive = localStorage.getItem('access_token') !== null;

    this.actRoute.params.subscribe(params => {
      let searchResults = JSON.parse(localStorage.getItem('search-results'));
      // console.log(searchResults);
      if (searchResults) {
        this.data.results = searchResults;
        localStorage.removeItem('search-results');
      }
      else


      if (!isActive) {
        // console.log('im not logged in ');
        ['public'].forEach(x => this.getData(x));

      } else {
       // console.log('im logged in ');
        ['list', 'public'].forEach(x => this.getData(x));

        // ['public'].forEach(x => this.getData(x));
      }

    });
  }

  search(query) {
    this.http.get(`${AppSettings.API_ENDPOINT}/analysis/search/${query}`)

      .subscribe((d:any) => {
        this.data.results = d;
        this.createForm();
      });
  }

  getData(type: string) {
    let apiUrl = `${AppSettings.API_ENDPOINT}/analysis/${type}`;
    this.http.get(apiUrl, this.login.optionByAuthorization())

      .subscribe((d:any) => {
        this.data[type] = d;
        // console.log(d);

        this.createForm();
      });

    // console.log(this.data[type]);

}

  createForm() {
    let combined_data = [];
    for (let t in this.data)

      combined_data = combined_data.concat(this.data[t]);

    // console.log(combined_data);

    this.temp = combined_data[0]['id2'];
    // console.log(this.temp);


    this.form = this.fb.group(
      _.zipObject(this.temp.map(x => x.id),
      _.times(this.temp.length, _.constant([false]))),

      );

  }

  submit() {
    let selecteds = _.toPairs(this.form.value).filter(x => x[1]).map(x => x[0]);
    // console.log(selecteds);
    this.router.navigate(['compare-analysis', selecteds]);
  }

}
