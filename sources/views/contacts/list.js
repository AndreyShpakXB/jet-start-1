import {JetView} from "webix-jet";

import contactsCollection from "../../models/contacts";

export default class ContactsListView extends JetView {
	config() {
		const list = {
			localId: "list",
			view: "list",
			maxWidth: 300,
			template:
			`<div style="display:flex;direction:column;align-items:center;">
				<div class='user-icon'></div>
				<div>
					<div>#FirstName# #LastName#</div>
					<div>#Email#</div>
				</div>
			</div>`,
			type: {
				height: 65
			},
			select: true,
			on: {
				onAfterSelect: id => this.show(`./contacts.info?id=${id}`)
			}
		};

		const button = {
			view: "button",
			label: "Add contact",
			click: () => {
				this.show("./contacts.details");
				this.$$("list").unselectAll();
			}
		};

		const ui = {
			rows: [
				list,
				button
			]
		};
		return ui;
	}

	init() {
		const list = this.$$("list");
		contactsCollection.waitData.then(() => {
			list.parse(contactsCollection);
			list.select(contactsCollection.getFirstId());
		});
		this.on(this.app, "onContactItemSelect", (id) => {
			this.show(`./contacts.info?id=${id}`);
			list.select(id);
		});
	}
}
