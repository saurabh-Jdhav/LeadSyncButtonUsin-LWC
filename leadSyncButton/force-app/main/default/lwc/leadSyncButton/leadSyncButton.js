import { LightningElement, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import syncLead from '@salesforce/apex/LeadSyncController.syncLead';

export default class LeadSyncButton extends LightningElement {
    @api recordId;
    handleSyncLead() {
        syncLead({ leadId: this.recordId })
            .then((result) => {
                if (result.startsWith('Error')) {
                    this.showToast('Error', result, 'error');
                } else {
                    this.showToast('Success', result, 'success');
                }
            });
    }

    showToast(title, message, variant) {
        const evt = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,
        });
        this.dispatchEvent(evt);
    }
}