public with sharing class NormalClass {
    @AuraEnabled(Cacheable = true)
    public static List<Contact> NormalMethod(String keyWord) {
        keyWord = '%'+ keyWord +'%';
        List<Contact> conList =  [SELECT Id, Name, Email, MobilePhone, Account.BillingCity, Account.BillingState 
                                  FROM Contact 
                                  WHERE 
                                  Name LIKE: keyWord
                                  LIMIT 10];
        return conList;
    }
}