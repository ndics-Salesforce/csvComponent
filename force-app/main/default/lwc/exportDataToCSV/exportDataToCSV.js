import { LightningElement, wire, track } from 'lwc';
import getOpportunity from '@salesforce/apex/OpportunityController.getOpportunity';

const cols = [
  {label: 'Id', fieldName: 'Id'},
  {label: 'Name', fieldName: 'Name'}
];

export default class ExportDataToCSV extends LightningElement {
  @track data;
  @track error;
  @track columns = cols;

  @wire(getOpportunity)
  Opportunity;

  constructor() {
    super();
    this.getallopportunities();
  }
  
  getallopportunities(){
    getOpportunity()
    .then((result) => {
      this.data = result;
      this.error = undefined;
    })
    .catch((error) => {
      this.error = error;
      this.data = undefined;
    });
  }

  downloadCSVFile(){
    let rowEnd = '\n';
    let csvString = '';
    let rowData = new Set();

    this.data.forEach(function(record) {
      Object.keys(record).forEach(function(key) {
        rowData.add(key);
      });
    });

    rowData = Array.from(rowData);

    csvString += rowData.join(',');
    csvString += rowEnd;

    for(let i=0; i < this.data.length; i++) {
      let colValue = 0;

      for(let key in rowData) {
        if(Object.prototype.hasOwnProperty.call(rowData,key)) {
          let rowKey = rowData[key];
          if(colValue > 0){
            csvString += ',';
          }
          let value = this.data[i][rowKey] === undefined ? '' : this.data[i][rowKey];
          csvString += '"' + value + '"';
          colValue ++ ;
        }
      }
      csvString += rowEnd;
    }

    // html要素を生成。
    // ダウンロードのためのアンカー要素(<a>タグ)を追加
    let downloadElement = document.createElement('a');

    downloadElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csvString);
    downloadElement.target = '_self';
    downloadElement.download = 'Opportunity Data.csv';
    // 親ノードの下に子ノードを追加。bodyにdownloadElementを追加する
    document.body.appendChild(downloadElement);
    downloadElement.click();
  }
}