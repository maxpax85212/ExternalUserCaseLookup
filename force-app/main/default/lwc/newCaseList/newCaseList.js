import { LightningElement, api, wire, track } from 'lwc';
import { getRecords } from 'lightning/uiRecordApi';
import CASENUMBER_FIELD from '@salesforce/schema/Case.CaseNumber';
import SUBJECT_FIELD from '@salesforce/schema/Case.Subject';
import CREATEDDATE_FIELD from '@salesforce/schema/Case.CreatedDate';
import DESCRIPTION_FIELD from '@salesforce/schema/Case.Description';
import STATUS_FIELD from '@salesforce/schema/Case.Status';
import getCases from '@salesforce/apex/GetRecordDataController.getCases'

export default class NewCaseList extends LightningElement {
    @api recordids;

    handleTileClick(evt) {
        // This component wants to emit a recordselected event to its parent
        const event = new CustomEvent('recordselected', {
            detail: evt.detail
        });
        // Fire the event from c-list
        this.dispatchEvent(event);
    }

    //Get cases from list of Ids passed into LWC
    cases = [];
    @track filteredData = [];
    parameterObject;
    @wire(getCases, {caseIds: '$recordids'})
    retrievedCases({error, data}){
        if (data) {
            this.cases = data;
            if(this.cases.length > 0){
              this.parameterObject = [];
              this.cases.forEach(caseRecord => {
                this.parameterObject.push({
                    recordIds: [caseRecord.Id],
                    fields: [CASENUMBER_FIELD, SUBJECT_FIELD, CREATEDDATE_FIELD, DESCRIPTION_FIELD, STATUS_FIELD]
                });
            });
        } else if (error){
            this.cases = undefined;
        }
    }
}
    @wire(getRecords, { records: '$parameterObject'})
    wiredRecords({ error, data }) {
        if (data) {
        data.results.forEach(record => {
          this.filteredData.push({
              Subject: record.result.fields.Subject.value,
              CaseNumber: record.result.fields.CaseNumber.value,
              CreatedDate: record.result.fields.CreatedDate.value,
              Description: record.result.fields.Description.value,
              Status: record.result.fields.Status.value,
              Id: record.result.id
          });
      });

    } else if (error) {
      console.log('error: ', error);
    }
  }
}