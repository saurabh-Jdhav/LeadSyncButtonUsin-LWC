public class A1_LeadController {
	public static Http http = new Http();
    public static HTTPResponse resBody= new HttpResponse();
    public static HttpRequest reqData= new HttpRequest();
    public static Id recordId;
    public static lead leadRef;

    public A1_LeadController(ApexPages.StandardController Controller){
        if(!Test.isRunningTest()) Controller.addFields(new List<String>{'firstName','lastName','leadsource','email','company','status'});
        leadRef = (Lead)controller.getRecord();
        recordId = leadRef.Id;
    }
    //Method which is called from the Visual Force page Action attribute
    public PageReference recordPageOfLead()
    {
        PageReference pageRef = new PageReference('/'+recordId);
     	pageRef.setRedirect(true);
        LeadDataWrapper wrapRef = new LeadDataWrapper();
        wrapRef.Id = recordId;
        wrapRef.firstName = leadRef.FirstName;
        wrapRef.lastName = leadRef.LastName;
        wrapRef.leadsource = leadRef.LeadSource;
        wrapRef.email = leadRef.email;
        wrapRef.company = leadRef.company;
        wrapRef.status = leadRef.status;
        system.debug('The lead : ' +wrapRef);
        string serialLead = JSON.serialize(wrapRef);
        CreateDestinationLead(serialLead);
        return pageRef;//Returns to the lead page
}
    public class LeadDataWrapper
    {
        public Id Id{get;set;}
        public String firstName {get; set;}
        public String lastName {get; set;}
        public String leadsource {get; set;}
        public String email {get; set;}
        public String company {get; set;}
        public String status{get; set;}
    }
    //cannot call future method from constructor & cannot make a method future if the paramarter is not a primitive datattype
    @future(callout=true)
	public static void CreateDestinationLead(string serialLead)
    {
    reqData = new HttpRequest();
    reqData.setMethod('PUT');
    reqData.setEndpoint('callout:DestinationNewNamedCredentials/services/apexrest/leadMap');
    reqData.setHeader('Content-Type', 'application/json;charset=UTF-8');
    reqData.setBody(serialLead);
        try{
            resBody = http.send(reqData);
            System.debug(resBody.getBody());
        }
        catch(exception e)
        {
            system.debug(e.getCause());
        }
    }
}