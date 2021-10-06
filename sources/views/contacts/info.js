import {JetView} from "webix-jet";

import contactsCollection from "../../models/contacts";

export default class ContactInfoView extends JetView {
	constructor(app, id) {
		super(app);
		this._contactId = id;
	}

	config() {
		const header = {
			localId: "header",
			cols: [
				{view: "label", localId: "name", label: "Name Surname", css: "label-info"},
				{
					css: "background-color: white;",
					cols: [
						{view: "button", value: "Delete", width: 150},
						{view: "button", value: "Edit", width: 150}
					]
				}
			]
		};

		const h = 50;
		const w = 150;
		const firstCol = {
			rows: [
				{view: "label", localId: "image", label: "image"},
				{view: "label", localId: "status", label: "Status", height: h, width: w}
			]
		};
		const secondCol = {
			rows: [
				{view: "label", localId: "email13", label: "email", height: h, width: w, css: "label-info"},
				{view: "label", localId: "skype", label: "skype", height: h, width: w},
				{view: "label", localId: "job", label: "job", height: h, width: w},
				{view: "label", localId: "company", label: "company", height: h, width: w}
			]
		};
		const thirdCol = {
			rows: [
				{view: "label", localId: "birthdate", label: "date of birth", height: h, width: w},
				{view: "label", localId: "location", label: "location", height: h, width: w}
			]
		};

		const content = {
			cols: [
				firstCol,
				secondCol,
				thirdCol,
				{}
			]
		};

		return {
			css: "page-background",
			margin: 1,
			paddingX: 10,
			rows: [
				header,
				content,
				{}
			]
		};
	}

	urlChange(view, url) {
		if (url[0].page === "contacts") {
			const id = url[0].params.id;
			const contact = contactsCollection.getItem(id);
			this.showContact(contact);
		}
	}

	showContact(contact) {
		this.$$("name").define("label", `${contact.name} ${contact.surname}`);
		console.log(this.$$("email13").label);
		this.$$("email13").define("label", `${contact.email} `);
		this.$$("skype").define("label", contact.skype);
		this.$$("job").define("label", contact.job);
		this.$$("company").define("label", contact.company);
		this.$$("birthdate").define("label", contact.birthdate);
		this.$$("location").define("label", contact.location);
		this.$$("status").define("label", contact.status);
	}
}
