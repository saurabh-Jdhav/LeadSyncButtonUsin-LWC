public with sharing class LeadSyncService {
    @future(callout=true)
    public static void syncLead(Id leadId) {
        try {
            Lead lead = [
                SELECT Id, FirstName, LastName, Email, Company
                FROM Lead
                WHERE Id = :leadId
            ];
            
            LeadData leadData = new LeadData(lead);
            String jsonString = JSON.serialize(leadData);
           // System.debug('Serialized Lead: ' + jsonString);
            
            Http http = new Http();
            HttpRequest req = new HttpRequest();
            req.setEndpoint('callout:DestinationNewNamedCredentials/services/apexrest/LeadSync');
            req.setMethod('PUT');
            req.setHeader('Content-Type', 'application/json');
            req.setBody(jsonString);
            
            HttpResponse res = http.send(req);
           // System.debug('Response Status: ' + res.getStatus());
          //  System.debug('Response Body: ' + res.getBody());
            if (res.getStatusCode() == 200) {
                System.debug('Error in syncLeadToDestination: ' + res.getBody());
            }
        
    	} catch (Exception e) {
        		System.debug('Error in syncLead: ' + e.getMessage());
    	}
	}
}