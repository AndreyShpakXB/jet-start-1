import {JetView} from "webix-jet";

import ContactsListView from "./contacts/list";

export default class ContactsView extends JetView {
	config() {
		return {
			cols: [
				ContactsListView,
				{$subview: true}
			]
		};
	}
}
