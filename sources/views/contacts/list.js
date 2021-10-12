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
			click: () => this.show("./contacts.details")
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
		contactsCollection.waitData.then(() => {
			const list = this.$$("list");
			list.parse(contactsCollection);
			list.select(contactsCollection.getFirstId());
		});
	}
}
