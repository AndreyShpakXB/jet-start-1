import {JetView} from "webix-jet";

import contactsCollection from "../../models/contacts";
import statusesCollection from "../../models/statuses";
import ActivityPopup from "../activities/activityPopup";
import ActivitiesTableView from "../activities/table";

export default class ContactInfoView extends JetView {
	config() {
		return statusesCollection.waitData.then(() => {
			const header = {
				padding: 10,
				localId: "header",
				cols: [
					{view: "label", localId: "name", label: "Name Surname", css: "label-info-name"},
					{
						css: "background-color: white;",
						cols: [
							{view: "button", label: "Delete", width: 150, type: "icon", icon: "wxi wxi-trash"},
							{view: "button", label: "Edit", width: 150, type: "icon", icon: "wxi wxi-pencil", click: () => this.show(`../contacts.details?id=${this.contactId}`)}
						]
					}
				]
			};

			const h = 50;
			const w = 250;
			const firstCol = {
				rows: [
					{view: "template", localId: "image", css: "contact-image", template: "Image"},
					{view: "label", localId: "StatusID", label: "Status", css: "status", width: w}
				]
			};
			const secondCol = {
				rows: [
					{view: "label", localId: "Email", label: "Email", height: h, width: w, css: "label-info", template: this.createIconTemplate("fas fa-envelope")},
					{view: "label", localId: "Skype", label: "Skype", height: h, width: w, css: "label-info", template: this.createIconTemplate("fab fa-skype")},
					{view: "label", localId: "Job", label: "Job", height: h, width: w, css: "label-info", template: this.createIconTemplate("fas fa-tag")},
					{view: "label", localId: "Company", label: "Company", height: h, width: w, css: "label-info", template: this.createIconTemplate("fas fa-building")}
				]
			};
			const thirdCol = {
				rows: [
					{view: "label", localId: "Birthday", label: "Date of birth", height: h, width: w, css: "label-info", template: this.createIconTemplate("fas fa-calendar-alt")},
					{view: "label", localId: "Address", label: "Location", height: h, width: w, css: "label-info", template: this.createIconTemplate("fas fa-map-marker-alt")}
				]
			};

			const space = {view: "template", width: 50, borderless: true};

			this._table = new ActivitiesTableView(this.app, true);
			const activitiesTab = {
				id: "activitiesTab",
				rows: [
					this._table,
					{view: "button", label: "Add activity", click: () => this._activityPopup.showPopup({ContactID: this._contactId})}
				]
			};

			const filesTab = {id: "filesTab", template: "template"};

			const tabs = {
				rows: [
					{
						type: "clean",
						rows: [
							{
								borderless: true,
								view: "tabbar",
								id: "tabbar",
								value: "listView",
								multiview: true,
								options: [
									{value: "Activities", id: "activitiesTab"},
									{value: "Files", id: "filesTab"}
								]
							}
						]
					},
					{animate: false, cells: [activitiesTab, filesTab]}
				]
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
					{height: 50},
					tabs
				]
			};
		});
	}

	init() {
		this._activityPopup = this.ui(ActivityPopup);
	}

	urlChange(view, url) {
		if (url[0].page === "contacts.info") {
			this._contactId = url[0].params.id;
			if (this._contactId) {
				this.showContact(this._contactId);
			}
		}
	}

	showContact(id) {
		const contact = contactsCollection.getItem(id);
		const name = this.$$("name");
		name.define("label", `${contact.FirstName} ${contact.LastName}`);
		name.refresh();

		const keys = Object.keys(contact).filter(key => key !== "id" && !key.includes("$") && key !== "name");
		keys.forEach((key) => {
			const obj = this.$$(key);
			if (obj) {
				if (key === "StatusID") {
					const status = statusesCollection.getItem(contact[key]).Value;
					obj.define("label", status);
				}
				else {
					obj.define("label", contact[key]);
				}
				obj.refresh();
			}
		});
		this._table.showData(this._contactId);
	}

	createIconTemplate(icon) {
		return `<div style='display:flex;align-items: center;;'>
					<span style='display:inline' class='${icon}'></span>&nbsp;#label#
				</div>`;
	}
}
