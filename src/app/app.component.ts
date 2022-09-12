import { Component, VERSION } from '@angular/core';
import * as convert from 'xml-js';
import * as XLSX from 'xlsx';
@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  csvContent: string;
  data: [][];
  ngOnInit() {}
  result = null;
  dataFormat = 'xml';

  fileSelected: any;

  files = ['csv', 'xlsx'];

  names = ' ';
  selectcheckboxvalue = false;

  constructor() {}

  selectfileType($event: any) {
    console.log($event);

    return ($event = this.names);
  }

  fileType(oInput: any, type: string): void | string {
    console.log(oInput.value);

    var fileend = oInput.value.split('.').pop();
    if (type === fileend) {
      alert('upload successfully ');
    } else {
      return (oInput.value = '');
    }
  }

  onFileChange(evt: any, types: string) {
    var fileend = evt.target.value.split('.').pop();
    if (types === fileend) {
      const target: DataTransfer = <DataTransfer>evt.target;
      if (target.files.length !== 1)
        throw new Error('Cannot use multiple files!');

      const reader: FileReader = new FileReader();

      reader.onload = (e: any) => {
        const bstr: string = e.target.result;
        const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
        const wsname: string = wb.SheetNames[0];
        const ws: XLSX.WorkSheet = wb.Sheets[wsname];
        // console.log(ws);

        this.data = XLSX.utils.sheet_to_json(ws, { header: 1 });
        console.log(this.data, 'this.data');
      };
      reader.readAsBinaryString(target.files[0]);
    } else {
      alert(
        'Sorry, ' + fileend + ' is invalid allowed extentions are .xlsx and csv'
      );
      return (evt.target.value = '');
    }
  }
  createdataformat() {
    const resArr = [];
    for (let i = 1; i < this.data.length; i++) {
      const obj = {};

      for (let j = 0; j < this.data[0].length; j++) {
        obj[this.data[0][j]] = this.data[i][j];
      }
      resArr.push(obj);
    }
    return resArr;
  }
  convertToJson() {
    this.result = this.createdataformat();
  }
  conertToxml() {
    const result = this.createdataformat();
    var options = { compact: true, ignoreComment: true, spaces: 4 };
    const xml = convert.js2xml(result, options);
    this.result = xml;
  }
  convertTodatFormat() {
    if (this.dataFormat === 'json') {
      this.convertToJson();
    } else if (this.dataFormat === 'xml') {
      this.conertToxml();
    }
  }
  onradiochange(dataformat) {
    this.dataFormat = dataformat;
    this.result = null;
  }
}
