public without sharing class GetRecordDataController {
    @AuraEnabled(cacheable=true)
    public static List<Case> getCases(String caseIds) {
        List<String> caseIdStrings = caseIds.Split(',');
        List<Id> caseIdsFinal = new List<Id>();
        for(String s : caseIdStrings){
            Id currentId = Id.valueOf(s);
            caseIdsFinal.add(currentId);
        }
        return [SELECT Id, Subject FROM Case WHERE Id IN :caseIdsFinal];
    }
    @AuraEnabled(cacheable=true)
    public static List<EmailMessage> getEmails(String caseid, String submitteremail ){
        // String thisIsATestValue = submitteremail;
        // return [SELECT ID, FromAddress, ToAddress FROM EmailMessage Where ParentId = :caseId Order By CreatedDate Desc];
        List<EmailMessage> allEmailMessage = [SELECT ID, FromAddress, ToAddress FROM EmailMessage Where ParentId = :caseid Order By CreatedDate Desc];
        List<EmailMessage> relevantEmails = new List<EmailMessage>();
        for(EmailMessage em : allEmailMessage){
            if(em.FromAddress.contains(submitteremail) || em.ToAddress.contains(submitteremail)){
                relevantEmails.add(em);
            }
        }
        return relevantEmails;
    }
}