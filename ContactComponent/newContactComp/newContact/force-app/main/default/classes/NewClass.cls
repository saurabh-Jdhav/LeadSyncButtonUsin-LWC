public with sharing class NewClass {
      @AuraEnabled(Cacheable=true)
      public static List<ContactWrapper> NewMethod(String keyWord)
      {
        
        keyWord = '%'+ keyWord +'%';
        
        List<ContactWrapper> objWrapperContact = new List<ContactWrapper>();
        // retrieve a list of up to 10 records whose "Name" field matches the "keyWord" search term
        List<Contact> objContact = [SELECT Name, Email, MobilePhone,
                                  Account.BillingCity, Account.BillingState
                                  FROM Contact
                                  WHERE Name LIKE: keyWord
                                  OR  Email LIKE: keyWord
                                  OR  MobilePhone LIKE: keyWord
                                  OR  Account.BillingCity LIKE: keyWord
                                  OR  Account.BillingState LIKE: keyWord
                                  LIMIT 10];
        for(Contact con :objContact )
        {
          
          ContactWrapper newWrp = new ContactWrapper();
          /* Assign the values of some fields from the Contact and its related Account
          to the corresponding fields of the ContactWrapper object */
          newWrp.Id = con.Id;
          newWrp.Name = con.Name;
          newWrp.Email = con.Email;
          newWrp.MobilePhone = con.MobilePhone;
          newWrp.BillingCity = con.Account.BillingCity;
          newWrp.BillingState = con.Account.BillingState;
          
          objWrapperContact.add(newWrp);
        }
        return objWrapperContact;
      }
      // This is a nested class named "ContactWrapper"
      public class ContactWrapper
      {
        @AuraEnabled
        public Id Id { get; set; }
        @AuraEnabled
        public String Name { get; set; }
        @AuraEnabled
        public String Email { get; set; }
        @AuraEnabled
        public String MobilePhone {get; set;}
        @AuraEnabled
        public String BillingCity { get; set; }
        @AuraEnabled
        public String BillingState { get; set; }
      }
    }