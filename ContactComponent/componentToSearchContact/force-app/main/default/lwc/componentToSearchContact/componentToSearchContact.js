import { LightningElement, wire} from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { deleteRecord } from 'lightning/uiRecordApi';
import { refreshApex } from '@salesforce/apex';
import searchContacts from '@salesforce/apex/WrapperClass.searchContacts';
//defining actions for each row of the table
const actions = [
          { label: 'View', name: 'view' },
          { label: 'Edit', name: 'edit' },
          { label: 'Delete', name: 'delete' }
        ];
//defining columns for the table
const COLUMNS = [
  { label: 'Name', fieldName: 'Name', type: 'text'},
  { label: 'Email', fieldName: 'Email', type: 'email' },
  { label: 'Mobile', fieldName: 'MobilePhone', type: 'phone' },
  { label: 'Billing City', fieldName: 'BillingCity', type: 'text' },
  { label: 'Billing State', fieldName: 'BillingState', type: 'text' },
  { label: '', type: 'action', typeAttributes: { rowActions: actions }, }
];
export default class ContactTable extends NavigationMixin(LightningElement) {
  columns = COLUMNS;
  contactList;
  contactSearch;

  connectedCallback()
  {
    this.displayTable = false;
  }

  handleSearchEvent(event) {
    let contactSearchs = event.target.value;
    // setting the value of the variable with the input value
    if(contactSearchs === '')
    {
      this.contactList=[];
      this.displayTable=false;
    }
    else if(contactSearchs.length > 2){
      this.contactSearch = contactSearchs;
      this.displayTable=true;
    }
  }
  //Retrieving contactList by calling wire with the Apex method and contactSearch parameter
  @wire(searchContacts, {keyWord : '$contactSearch'}) contactList;

  //This function will create a new contact
  handleContactCreate() {
    this[NavigationMixin.Navigate]({
      type: 'standard__objectPage',
      attributes:
      {
        objectApiName: 'Contact',
        actionName: 'new'
      }
    });
  }
  //This function will return view, edit, delete the record based what will select in action
  crudActions(event) {
    const actionName = event.detail.action.name;
    const row = event.detail.row;
    this.recordId = row.Id;
    switch (actionName) {
      case 'view':
        this[NavigationMixin.Navigate]({
          type: 'standard__recordPage',
          attributes: {
            recordId: row.Id,
            actionName: 'view'
          }
        });
        break;
      case 'edit':
          this.navigateToEditPage(row.Id);
          return refreshApex(this.contactList); 
                
     case 'delete':
        this.delContact();
        return refreshApex(this.contactList); // Record will be deleted
    }
  }
  //deleting the record
  delContact() {
    //method call to delete a record
    deleteRecord(this.recordId)
      .then(() => {
        // We are firing a toast message
        this.dispatchEvent(
          new ShowToastEvent({
            title: 'Success',
            message: 'Record is successfully deleted',
            variant: 'success'
          })
        );
        return refreshApex(this.contactList);
      })
      .catch((error) => {
        console.log(error);
        this.dispatchEvent(
          new ShowToastEvent({
            title: 'ERROR',
            message: 'Cannot delete this record since it is associated with a case',
            variant: 'error'
          })
        );
      });
  }
  
  navigateToEditPage(recordId) {
    this[NavigationMixin.Navigate]({
      type: 'standard__recordPage',
      attributes: {
        recordId: recordId,
        objectApiName: 'Contact',
        actionName: 'edit'   
      }
    }).then(()=>{
      return refreshApex(this.contactList);
    })
    
  }
}

/*
        edit
        this[NavigationMixin.Navigate]({
          type: 'standard__recordPage',
          attributes: {
            recordId: row.Id,
            objectApiName: 'Contact',
            actionName: 'edit'
          }
*/
/*refreshApex()
  {
    return Promise.all([
      eval("$A.get('e.force:refreshView').fire()"),
      new Promise((resolve) => setTimeout(resolve,10))
    ])
  }*/