import { LightningElement, api } from 'lwc';

export default class NewCaseSelector extends LightningElement {
    @api recordIds;
    @api submitterEmail;
    selectedRecordId;

    handleRecordSelected(evt) {
        this.selectedRecordId = evt.detail;
    }
}