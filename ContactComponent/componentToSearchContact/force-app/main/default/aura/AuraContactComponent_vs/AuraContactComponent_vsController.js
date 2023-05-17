({
    doInit : function(component, event, helper) {
        // Define the columns for the datatable
        component.set('v.columns', [
            {label: 'First Name', fieldName: 'FirstName', type: 'text'},
            {label: 'Last Name', fieldName: 'LastName', type: 'text'},
            {label: 'Email', fieldName: 'Email', type: 'email'},
            {label: 'Phone', fieldName: 'Phone', type: 'phone'},
            {label: 'Billing City', fieldName: 'BillingCity', type: 'text'},
            {label: 'Billing State', fieldName: 'BillingState', type: 'text'}
        ]);
        //Load the contacts related to the account
        helper.loadContacts(component);
    }
})