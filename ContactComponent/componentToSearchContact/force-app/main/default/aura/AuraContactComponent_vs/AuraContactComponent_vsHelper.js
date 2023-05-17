({
    loadContacts : function(component) {
    // Get the getContacts method from the Apex controller
    var action = component.get("c.getContacts");
    // Set the accountId parameter for the Apex method
    action.setParams({ accountId: component.get('v.recordId') });

    // Set the callback function for the action
    action.setCallback(this, function(response) {
        var state = response.getState();
        if (state === "SUCCESS") {
            // Set the contacts attribute with the returned data
            var contacts = response.getReturnValue().map(function(contact) {
                console.log('Contact:', contact);
                return{
                    Id: contact.Id,
                    FirstName: contact.FirstName,
                    LastName: contact.LastName,
                    Email: contact.Email,
                    Phone: contact.Phone,
                    BillingCity: contact.Account.BillingCity,
                    BillingState: contact.Account.BillingState
                };
                
            });
            component.set("v.contacts", contacts);
        } else {
            console.log("Failed with following state: " + state);
        }
    });
    // Enqueue the action to be executed
    $A.enqueueAction(action);
}
})