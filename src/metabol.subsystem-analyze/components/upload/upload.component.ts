import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ConcentrationTableComponent} from '../concentration-table/concentration-table.component';
import {MetaboliteConcentration} from '../../models/metaboliteConcentration';
import * as _ from 'lodash';
import * as XLSX from 'xlsx';
import { utils, write, WorkBook } from 'xlsx';

import {SubsystemAnalyzeService} from '../../services/subsystem-analyze';
import {Router} from '@angular/router';
import {LoginService} from '../../../metabol.auth/services/login';
import {  FileUploader, FileSelectDirective, FileItem, ParsedResponseHeaders } from 'ng2-file-upload/ng2-file-upload';
// import {Http} from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { HttpClientModule } from '@angular/common/http';
// import { HttpModule } from '@angular/http';




@Component({
  selector: 'app-upload',
  templateUrl: 'upload.component.html',
  styleUrls: ['upload.component.css'],
  providers: [SubsystemAnalyzeService,SimpleNotificationsModule]
})
export class UploadComponent {
  conTable: Array<[string, number]> = [];
  file: any;


  selected = 'Combined.json';
  temp:JSON;
  temp2;
  data;
  ooldM;
  arrayBuffer: any;
  fileToUpload: File = null;
  file3:any;
  file2: File;
  file5: any;


  constructor(fb: FormBuilder,
  private subSerivce: SubsystemAnalyzeService,
  private router: Router,
  private login: LoginService,
  private notify: SimpleNotificationsModule,
  private httpClient: HttpClient
) { }

  jsonChange($event) {
    this.readJson($event.target);
  }

  readJson(inputValue: any) {
    var file: File = inputValue.files[0];
    var myReader: FileReader = new FileReader();

    let file2 = this.selected;
    myReader.onload = (e: any) =>{
    // this.temp = JSON.parse(JSON.stringify(e.target.result));
    this.temp = JSON.parse(e.target.result);
    console.log(this.temp);
    for (let t in this.temp){
      console.log(t);
      console.log(this.temp[t]);

      this.subSerivce.getJSON(file2).subscribe(data => {
        if (data[t] === null || data[t] === undefined || data[t] === "" || data[t].lenght === 0) {
          // if this condition apply mostly it means we dont need to map the metabolic to other database,
          // and its the correct name so we keep it
         t = t;
        } else { // if mapping is needed(in other way if mapping name exist in our combined database )
          this.ooldM = t;
          t = data[t] + " \t(" + this.ooldM + ")";
          console.log(t);
        }
        this.conTable.push([t,this.temp[t]]);



      }); 
    }
      
    

      // this.conTable = <Array<[string, number]>>_.toPairs(JSON.parse(e.target.result));
    }
    myReader.readAsText(file);
  }

  csvChange($event) {
    this.readCsv($event.target);
  }

  readCsv(inputValue: any) {
    // var file: File = inputValue.files[0];
    // var myReader: FileReader = new FileReader();
    // myReader.onload = (e: any) => {
    //   let lines = e.target.result.split("\n");
    //   for (let i of lines) {
    //     let c = i.split(',');
    //     this.conTable.push(c);
    //   }
    // }
    // myReader.readAsText(file);
    var file: File = inputValue.files[0];
    var myReader: FileReader = new FileReader();
    myReader.onload = (e: any) => {
      let lines = e.target.result.split("\n");
      for (let i of lines) {
        let c = i.split(',');
        let file2 = this.selected;
        this.subSerivce.getJSON(file2).subscribe(data => {  // opens combined.json to get te metabolic name if needed
          //data contains the data from combined.json
          if (data[c[0]] === null || data[c[0]] === undefined || data[c[0]] === "" || data[c[0]].lenght === 0) {
            // if this condition apply mostly it means we dont need to map the metabolic to other database,
            // and its the correct name so we keep it
            c[0] = c[0];
          } else { // if mapping is needed(in other way if mapping name exist in our combined database )
            this.ooldM = c[0];
            c[0] = data[c[0]] + " \t(" + this.ooldM + ")";
            console.log(c);
          }
        });
        this.conTable.push(c);
      }
    }
    myReader.readAsText(file);


  }

  ///////////////////////////////// Workbench
  readText(inputValue: any){

    this.file3 = inputValue.target.files[0];
    let fileReader = new FileReader();
    fileReader.onload = (e) => {
      // console.log(fileReader.result);

      this.httpClient.post('http://127.0.0.1:5000/workbench', {
        data: fileReader.result
      }).subscribe(data => {
          const recData = data as JSON;
          console.log(recData);


        },
        err => {
          console.log("Error occured");
        }
      );



    }
    fileReader.readAsText(this.file3);

  }
  //////////////////////////// excel

  incomingfile(event) {
    this.file5 = event.target.files[0];
    this.onFileChange(this.file5);
  }

  onFileChange(file: any) {
    /* wire up file reader */
    // const target: DataTransfer = <DataTransfer>(evt.target);
    // if (target.files.length !== 1) throw new Error('Cannot use multiple files');
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      /* read workbook */
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, {type: 'binary'});

      /* grab first and second sheet */
      const wsname: string = wb.SheetNames[0];
      const wsname2: string = wb.SheetNames[1];

      const ws: XLSX.WorkSheet = wb.Sheets[wsname];
      const ws2: XLSX.WorkSheet = wb.Sheets[wsname2];
      /* save data */
      const data2 = <any> (XLSX.utils.sheet_to_json(ws, {header: 1}));
      const meta = <any> (XLSX.utils.sheet_to_json(ws2, {header: 1}));
      // console.log(ws);
      // console.log(data2);
      // console.log(meta);

      this.httpClient.post('http://127.0.0.1:5000/excel', {
        data: data2, meta: meta
      }).subscribe(data => {
          const recData = data as JSON;
          console.log(recData);
          // localStorage.setItem('excel-meta3', JSON.stringify(recData[4]));
          // localStorage.setItem('excel-meta2', JSON.stringify(recData[3]));
          // localStorage.setItem('excel-meta1', JSON.stringify(recData[2]));
          // localStorage.setItem('excel-dataa', JSON.stringify(recData[1]));
          //
          // //// Testing using data without processing in api
          // localStorage.setItem('excel-test', JSON.stringify(data2));
          // localStorage.setItem('excel-test2', JSON.stringify(meta));
          // this.router.navigate(['/analyze/excel-data']);

        },
        err => {
          console.log("Error occured");
        }
      );
      // console.log(this.metabol.value);
    };
    reader.readAsBinaryString(this.file5);
  }

}
