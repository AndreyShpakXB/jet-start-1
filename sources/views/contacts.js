import {JetView} from "webix-jet";

import ContactInfoView from "./contacts/info";
import ContactsListView from "./contacts/list";

export default class ContactsView extends JetView {
	config() {
		return {
			cols: [
				ContactsListView,
				ContactInfoView
			]
		};
	}
}
