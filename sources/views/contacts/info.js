import {JetView} from "webix-jet";

import contactsCollection from "../../models/contacts";

function setIcon(icon) {
	const template =
	`<div style='display:flex;align-items: center;;'>
		<span style='display:inline' class='fas ${icon}'></span>&nbsp;#label#
	</div>`;

	return template;
}

export default class ContactInfoView extends JetView {
	constructor(app, id) {
		super(app);
		this._contactId = id;
	}

	config() {
		const header = {
			padding: 10,
			localId: "header",
			cols: [
				{view: "label", localId: "name", label: "Name Surname", css: "label-info-name"},
				{
					css: "background-color: white;",
					cols: [
						{view: "button", label: "Delete", width: 150, type: "icon", icon: "wxi wxi-trash"},
						{view: "button", label: "Edit", width: 150, type: "icon", icon: "wxi wxi-pencil"}
					]
				}
			]
		};

		const h = 50;
		const w = 250;
		const firstCol = {
			padding: 10,
			rows: [
				{view: "template", localId: "image", css: "contact-image", template: "img"},
				{view: "label", localId: "status", label: "Status", css: "status", width: w}
			]
		};
		const secondCol = {
			rows: [
				{view: "label", localId: "email", label: "Email", height: h, width: w, css: "label-info", template: setIcon("fa-envelope")},
				{view: "label", localId: "skype", label: "Skype", height: h, width: w, css: "label-info", template: setIcon("fa-skype")},
				{view: "label", localId: "job", label: "Job", height: h, width: w, css: "label-info", template: setIcon("fa-tag")},
				{view: "label", localId: "company", label: "Company", height: h, width: w, css: "label-info", template: setIcon("fa-building")}
			]
		};
		const thirdCol = {
			rows: [
				{view: "label", localId: "birthdate", label: "Date of birth", height: h, width: w, css: "label-info", template: setIcon("fa-calendar-alt")},
				{view: "label", localId: "location", label: "Location", height: h, width: w, css: "label-info", template: setIcon("fa-map-marker-alt")}
			]
		};

		const space = {
			view: "template",
			width: 50,
			borderless: true
		};

		const content = {
			cols: [
				firstCol,
				space,
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
			if (contact) {
				this.showContact(contact);
			}
			else if (id) {
				this.webix.message({
					type: "error",
					text: `Contact is not founded, id:${id}`
				});
			}
		}
	}

	showContact(contact) {
		const name = this.$$("name");
		name.define("label", `${contact.name} ${contact.surname}`);
		name.refresh();

		const email = this.$$("email");
		email.define("label", `${contact.email}`);
		email.refresh();

		const skype = this.$$("skype");
		skype.define("label", contact.skype);
		skype.refresh();

		const job = this.$$("job");
		job.define("label", contact.job);
		job.refresh();

		const company = this.$$("company");
		company.define("label", contact.company);
		company.refresh();

		const birhday = this.$$("birthdate");
		birhday.define("label", contact.birthdate);
		birhday.refresh();

		const location = this.$$("location");
		location.define("label", contact.location);
		location.refresh();

		const status = this.$$("status");
		status.define("label", contact.status);
		status.refresh();
	}
}

