import {JetView} from "webix-jet";

import contactsCollection from "../../models/contacts";

export default class ContactsListView extends JetView {
	config() {
		const _ = this.app.getService("locale")._;
		const list = {
			localId: "list",
			view: "list",
			maxWidth: 300,
			template: this.createTemplate,
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
			label: _("Add contact"),
			click: this.onAdd
		};

		const search = {
			localId: "search",
			view: "text",
			placeholder: _("type to find matching contacts")
		};

		const ui = {
			rows: [
				search,
				list,
				button
			]
		};
		return ui;
	}

	createTemplate(obj) {
		if (!obj.FirstName) obj.FirstName = "Name";
		if (!obj.LastName) obj.LastName = "Surname";
		let name = `${obj.FirstName} ${obj.LastName}`;
		return `<div style="display:flex;direction:column;align-items:center;">
			<div class='user-icon'>
				<img style='object-fit: fill; height: 42px; width: 42px; margin: -1px;' src='${obj.Photo}'></img>
			</div>
			<div>
				<div class='list-name'>${name}</div>
				<div>${obj.Email}</div>
			</div>
		</div>`;
	}

	onAdd() {
		this.$scope.show("./contacts.details");
		this.$scope.$$("list").unselectAll();
	}

	init() {
		const list = this.$$("list");
		const showContact = (id) => {
			this.show(`./contacts.info?id=${id}`);
			list.select(id);
		};

		contactsCollection.waitData.then(() => {
			list.parse(contactsCollection);
			list.select(contactsCollection.getFirstId());
		});
		this.on(this.app, "onAfterDetailsInfoClosed", (id) => {
			showContact(id);
		});
		this.on(this.app, "onAfterContactDeleted", (id) => {
			showContact(id);
		});
		this.$$("search").attachEvent("onTimedKeyPress", () => {
			const value = this.$$("search").getValue().toLowerCase();
			if (!value) {
				contactsCollection.filter(() => true);
				return;
			}
			const item = contactsCollection.getItem(contactsCollection.getFirstId());
			if (!item) {
				contactsCollection.filter(() => true);
				return;
			}
			const keys = Object.keys(item).filter(val => val !== "Photo");
			list.filter(obj => keys.some(key => obj[key].toString().toLowerCase().indexOf(value) !== -1));
		});
	}
}
