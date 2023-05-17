import { LightningElement } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { deleteRecord } from 'lightning/uiRecordApi';
import { refreshApex } from '@salesforce/apex';
import NormalMethod from '@salesforce/apex/NormalClass.NormalMethod';

const actions = [
    { label: 'View', name: 'view' },
    { label: 'Edit', name: 'edit' },
    { label: 'Delete', name: 'delete' }
  ];

const COLUMNS = [
    { label: 'Name', fieldName: 'Name', type: 'text'},
    { label: 'Email', fieldName: 'Email', type: 'email' },
    { label: 'Mobile', fieldName: 'MobilePhone', type: 'phone' },
    { label: 'Billing City', fieldName: 'BillingCity', type: 'text' },
    { label: 'Billing State', fieldName: 'BillingState', type: 'text' },
    { label: '', type: 'action', typeAttributes: { rowActions: actions }, }
  ];

export default class ImpContactCompo extends NavigationMixin(LightningElement) {
  columns = COLUMNS;
  contactList;    
  displayTable = false;
  searchKey = '';

  connectedCallback()
  {
    this.displayTable = false;
  }

  handleSearchEvent(event) {
    
    this.searchKey = event.target.value;
    if(this.searchKey.length > 2){
    this.NormalMethod();
    this.displayTable = true;
    }
    else{
      this.displayTable = false;
      return [];
    }
  }
 /* 
  NewMethod() {
    NewMethod({ keyWord: this.searchKey })
          .then(result => {
              this.contactList = result;
              this.displayTable=true;
          })
          .catch(error => {
              console.error('Error in fetching contacts', error);
          });

}
*/
  NormalMethod() {
    NormalMethod({ keyWord: this.searchKey })
    .then(result => {
      this.contactList = result.map(contact => ({
      Id: contact.Id,
      Name: contact.Name,
      Email: contact.Email,
      MobilePhone: contact.MobilePhone,
      BillingCity: contact.Account.BillingCity,
      BillingState: contact.Account.BillingState
    }));
      this.displayTable = true;
    })
    .catch(error => {
    console.error('Error in fetching contacts', error);
    });
}

handleContactCreate(){
  this[NavigationMixin.Navigate]({
    type: 'standard__objectPage',
    attributes:
    {
      objectApiName: 'Contact',
      actionName: 'new'
    }
  });
}

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
  //window.loading.reload();
  
}
}
