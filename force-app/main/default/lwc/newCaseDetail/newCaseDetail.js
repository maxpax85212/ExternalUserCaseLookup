import { LightningElement, api, wire, track } from 'lwc';
import { getRecord, getFieldValue } from "lightning/uiRecordApi";
import { getRecords } from 'lightning/uiRecordApi';

import CASENUMBER_FIELD from '@salesforce/schema/Case.CaseNumber';
import SUBJECT_FIELD from '@salesforce/schema/Case.Subject';
import CREATEDDATE_FIELD from '@salesforce/schema/Case.CreatedDate';
import DESCRIPTION_FIELD from '@salesforce/schema/Case.Description';
import EXTERNAL_STATUS_FIELD from '@salesforce/schema/Case.External_Status__c';
import getEmails from '@salesforce/apex/GetRecordDataController.getEmails'
import EMAIL_SUBJECT_FIELD from '@salesforce/schema/EmailMessage.Subject';
import EMAIL_FROM_ADDRESS_FIELD from '@salesforce/schema/EmailMessage.FromAddress';
import EMAIL_TEXT_BODY_FIELD from '@salesforce/schema/EmailMessage.TextBody';
import EMAIL_TO_ADDRESS_FIELD from '@salesforce/schema/EmailMessage.ToAddress';
import EMAIL_CREATED_DATE_FIELD from '@salesforce/schema/EmailMessage.CreatedDate';
import EMAIL_HTMLBODY_FIELD from '@salesforce/schema/EmailMessage.HtmlBody';




export default class NewCaseDetail extends LightningElement {
    
    // Ensure changes are reactive when product is updated
    record;
    @track record;

    @api submitterEmail;
    @api recordId;
    @track recordId;

    //Get individual record
    @wire(getRecord, { recordId: "$recordId", fields: [CASENUMBER_FIELD, SUBJECT_FIELD, CREATEDDATE_FIELD, DESCRIPTION_FIELD, EXTERNAL_STATUS_FIELD] })
    record;

    //Set individual record fields
    get CaseNumber() {
        return getFieldValue(this.record.data, CASENUMBER_FIELD);
      }
    
    get Subject() {
        return getFieldValue(this.record.data, SUBJECT_FIELD);
    }  

    get Description() {
        return getFieldValue(this.record.data, DESCRIPTION_FIELD);
    }  
    get ExternalStatus() {
        return getFieldValue(this.record.data, EXTERNAL_STATUS_FIELD);
    }

    //Get all emails relating to the case
    emails = [];
    @track filteredData = [];
    parameterObject;
    @wire(getEmails, {
        caseid: '$recordId',
        submitteremail: '$submitterEmail'})
    retrievedEmails({error, data}){
        if (data) {
            this.emails = data;
            this.filteredData = [];
            if(this.emails.length > 0){
              this.parameterObject = [];
              this.emails.forEach(emailRecord => {
                this.parameterObject.push({
                    recordIds: [emailRecord.Id],
                    fields: [EMAIL_SUBJECT_FIELD, EMAIL_FROM_ADDRESS_FIELD, EMAIL_TEXT_BODY_FIELD, EMAIL_TO_ADDRESS_FIELD, EMAIL_CREATED_DATE_FIELD, EMAIL_HTMLBODY_FIELD]
                });
            });
        } else if (error){
            this.emails = undefined;
        }
    }
}
    @wire(getRecords, { records: '$parameterObject'})
    wiredRecords({ error, data }) {
        if (data) {
            this.filteredData = [];
        data.results.forEach(record => {
          this.filteredData.push({
              Subject: record.result.fields.Subject.value,
              TextBody: record.result.fields.TextBody.value,
              CreatedDate: record.result.fields.CreatedDate.value,
              FromAddress: record.result.fields.FromAddress.value,
              ToAddress: record.result.fields.ToAddress.value,
              Id: record.result.id
          });
      });

    } else if (error) {
      console.log('error: ', error);
    }
  }
}