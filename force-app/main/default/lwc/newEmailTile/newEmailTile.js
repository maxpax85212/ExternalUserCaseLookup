import { LightningElement, api, track, wire} from 'lwc';

export default class NewEmailTile extends LightningElement {
    @api record;
    @track record;
    SubjectValue;
    TextBodyValue;
    sliceSubjectLocation;
    sliceBodyLocation;

    //Modify Subject to remove the thread portion of the Subject
    @api
    get subject() {
        return this.SubjectValue
    }
    set subject(value){
        this.sliceSubjectLocation = value.indexOf("[ thread::");
        if(this.sliceSubjectLocation !== -1){
            this.SubjectValue = value.slice(0,this.sliceSubjectLocation);
        }else{
            this.SubjectValue = value;
        }
    }

    //Modify the textbody to get rid of the extra text at the bottom
    @api
    get textbody() {
        if(textBody !== null){
            return this.TextBodyValue
        }
    }
    set textbody(value){
        if(value !== null){
            this.sliceBodyLocation = value.indexOf("-----");
            if(this.sliceBodyLocation !== -1){
                this.TextBodyValue = value.slice(0,this.sliceBodyLocation);
            }else{
                this.sliceBodyLocation = value.indexOf("_____");
                if(this.sliceBodyLocation !== -1){
                    this.TextBodyValue = value.slice(0,this.sliceBodyLocation);
                }else{
                    this.TextBodyValue = 'Your email message could not be displayed. Please contact the admin team for assistance, and include the case selected when this message appeared.';
                }
            }
        }
    }
}