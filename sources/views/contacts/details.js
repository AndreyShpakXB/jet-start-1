import {JetView} from "webix-jet";

import {dateFormtM, serverFormat} from "../../helpers";
import contactsCollection from "../../models/contacts";
import statusesCollection from "../../models/statuses";

export default class DetailsView extends JetView {
	config() {
		const header = {view: "label", localId: "name", label: "Edit contact", css: "label-info-name"};

		const maxWidth = 450;
		const labelWidth = 150;
		const col1 = {
			minWidth: 200,
			margin: 15,
			rows: [
				{view: "text", label: "First name", name: "FirstName", maxWidth, labelWidth},
				{view: "text", label: "Last name", name: "LastName", maxWidth, labelWidth},
				{view: "datepicker", label: "Joining date", name: "StartDate", maxWidth, labelWidth, format: dateFormtM},
				{view: "combo", label: "Status", name: "StatusID", maxWidth, labelWidth, options: {body: {data: statusesCollection, template: "#Value#"}}},
				{view: "text", label: "Job", name: "Job", maxWidth, labelWidth},
				{view: "text", label: "Company", name: "Company", maxWidth, labelWidth},
				{view: "text", label: "Website", name: "Website", maxWidth, labelWidth},
				{view: "text", label: "Address", name: "Address", maxWidth, labelWidth}
			]
		};

		const col2 = {
			minWidth: 200,
			margin: 15,
			rows: [
				{view: "text", label: "Email", name: "Email", maxWidth, labelWidth},
				{view: "text", label: "Skype", name: "Skype", maxWidth, labelWidth},
				{view: "text", label: "Phone", name: "Phone", maxWidth, labelWidth},
				{view: "datepicker", label: "Birthday", name: "Birthday", maxWidth, labelWidth, format: dateFormtM},
				{
					borderless: true,
					cols: [
						{view: "template", localId: "image", css: "contact-image", template: "Image", height: 200},
						{
							margin: 10,
							paddingX: 10,
							rows: [
								{},
								{view: "button", label: "Change photo", width: 150},
								{view: "button", label: "Delete photo", width: 150}
							]
						}
					]
				}
			]
		};

		const buttons = {
			cols: [
				{},
				{
					view: "button",
					label: "Cancel",
					width: 100,
					click: () => {
						this.app.callEvent("onContactItemSelect", [this._contactId]);
					}
				},
				{
					view: "button",
					label: "Save",
					width: 150,
					localId: "button_add",
					click: () => {
						const form = this.$$("form");
						const object = form.getValues();

						if (!form.validate()) return;

						const formatter = webix.Date.dateToStr(serverFormat);
						object.StartDate = formatter(object.StartDate);
						object.Birthday = formatter(object.Birthday);

						if (object.id) {
							contactsCollection.updateItem(object.id, object);
						}
						else {
							contactsCollection.add(object);
						}
						this.app.callEvent("onContactItemSelect", [object.id]);
					}
				}
			]
		};

		const form = {
			view: "form",
			localId: "form",
			elements: [
				{cols: [col1, {maxWidth: 100}, col2]},
				{},
				buttons
			],
			borderless: true,
			rules: {
				FirstName: this.webix.rules.isNotEmpty,
				LastName: this.webix.rules.isNotEmpty,
				Email: this.webix.rules.isNotEmpty
			}
		};

		return {padding: 15, rows: [header, form]};
	}

	urlChange(view, url) {
		if (url[0].page === "contacts.details") {
			if (!url[0].params.id) {
				this.$$("form").clear();
				this.showAsAddingForm();
				this._contactId = contactsCollection.getFirstId();
			}
			else {
				this._contactId = url[0].params.id;
				const contact = contactsCollection.getItem(this._contactId);
				if (contact) {
					this.setValues(contact);
				}
			}
		}
	}

	setValues(item) {
		this.$$("form").setValues(item);
	}

	showAsAddingForm() {
		const name = this.$$("name");
		name.define("label", "Add contact");
		name.refresh();

		const button = this.$$("button_add");
		button.define("label", "Add contact");
		button.refresh();
	}
}
