public class LeadData {
    public Id Id;
    public String FirstName;
    public String LastName;
    public String Email;
    public String Company;
   

    public LeadData(Lead lead) {
        this.Id = lead.Id;
        this.FirstName = lead.FirstName;
        this.LastName = lead.LastName;
        this.Email = lead.Email;
        this.Company = lead.Company;
    }
}