import {JetView} from "webix-jet";

import ContactInfoView from "./contacts/info";
import ContactsListView from "./contacts/list";

export default class ContactsView extends JetView {
	config() {
		const list = new ContactsListView(this.app);
		const info = new ContactInfoView(this.app, 0);
		return {
			cols: [
				list,
				info
			]
		};
	}
}
