import { LightningElement, api } from 'lwc';

export default class NewCaseTile extends LightningElement {
    @api record;
    tileClick() {
        const event = new CustomEvent('tileclick', {
            // detail contains only primitives
            detail: this.record.Id
        });
        // Fire the event from c-tile
        this.dispatchEvent(event);
    }
}