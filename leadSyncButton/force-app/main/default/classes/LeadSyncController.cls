public with sharing class LeadSyncController {
    @AuraEnabled
    public static void syncLead(Id leadId) {
        LeadSyncService.syncLead(leadId);
    }
}