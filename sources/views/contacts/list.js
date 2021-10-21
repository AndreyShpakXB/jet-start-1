import BaseView from "../../BaseView";
import contactsCollection from "../../models/contacts";
import statusesCollection from "../../models/statuses";

export default class ContactsListView extends BaseView {
	config() {
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
				onAfterSelect: (id) => {
					if (!id) return;
					this.show(`./contacts.info?id=${id}`);
				}
			}
		};

		const button = {
			view: "button",
			label: this._("Add contact"),
			click: this.onAdd
		};

		const search = {
			localId: "search",
			view: "text",
			placeholder: this._("type to find matching contacts")
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

	init() {
		const list = this.$$("list");
		const showContact = (id) => {
			if (!id) return;
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
		this.on(this.$$("search"), "onTimedKeyPress", () => {
			const value = this.$$("search").getValue().toLowerCase().trim();
			const count = contactsCollection.count();
			if (!value || !count) {
				list.filter();
				return;
			}
			const keys = ["FirstName", "LastName", "Job", "Company", "Website", "Address", "Email", "Skype"];
			list.filter((obj) => {
				const res = keys.some((key) => {
					const val = obj[key].toString().toLowerCase();
					return val.indexOf(value) !== -1;
				});
				if (res) return true;
				if (obj.Phone === value) return true;

				const statusId = obj.StatusID;
				if (statusId) {
					const status = statusesCollection.getItem(obj.StatusID);
					if (status && status.Value.toLowerCase().indexOf(value) !== -1) {
						return true;
					}
				}

				if (obj.Birthday) {
					const birthdayYear = obj.Birthday.substring(0, 4);
					if (birthdayYear === value) {
						return true;
					}
				}
				if (obj.StartDate) {
					const startdate = obj.StartDate.substring(0, 4);
					if (startdate === value) {
						return true;
					}
				}
				return false;
			});
		});
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
}
