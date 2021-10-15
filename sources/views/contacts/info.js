import {JetView} from "webix-jet";

import contactsCollection from "../../models/contacts";
import filesCollection from "../../models/files";
import statusesCollection from "../../models/statuses";
import ActivityPopup from "../activities/activityPopup";
import ActivitiesTableView from "../activities/table";
import FilesTableView from "./files";

export default class ContactInfoView extends JetView {
	config() {
		return statusesCollection.waitData.then(() => {
			const header = {
				padding: 10,
				localId: "header",
				cols: [
					{view: "label", localId: "name", label: "", css: "label-info-name"},
					{
						css: "background-color: white;",
						cols: [
							{
								view: "button",
								label: "Delete",
								width: 150,
								type: "icon",
								icon: "wxi wxi-trash",
								click: () => {
									webix.confirm("Are you sure you want to delete this item permanently?").then(() => {
										contactsCollection.remove(this._contactId);
										this.app.callEvent("onAfterContactDeleted", [contactsCollection.getFirstId()]);
									});
								}
							},
							{view: "button", label: "Edit", width: 150, type: "icon", icon: "wxi wxi-pencil", click: () => this.show(`../contacts.details?id=${this._contactId}`)}
						]
					}
				]
			};

			const h = 50;
			const w = 250;
			const firstCol = {
				rows: [
					{view: "template", localId: "image", css: "contact-image", template: "Image"},
					{view: "label", localId: "StatusID", label: "", css: "status", width: w}
				]
			};
			const secondCol = {
				rows: [
					{view: "label", localId: "Email", label: "", height: h, width: w, css: "label-info", template: this.createIconTemplate("fas fa-envelope")},
					{view: "label", localId: "Skype", label: "", height: h, width: w, css: "label-info", template: this.createIconTemplate("fab fa-skype")},
					{view: "label", localId: "Job", label: "", height: h, width: w, css: "label-info", template: this.createIconTemplate("fas fa-tag")},
					{view: "label", localId: "Company", label: "", height: h, width: w, css: "label-info", template: this.createIconTemplate("fas fa-building")}
				]
			};
			const thirdCol = {
				rows: [
					{view: "label", localId: "Birthday", label: "", height: h, width: w, css: "label-info", template: this.createIconTemplate("fas fa-calendar-alt")},
					{view: "label", localId: "Address", label: "", height: h, width: w, css: "label-info", template: this.createIconTemplate("fas fa-map-marker-alt")}
				]
			};

			const space = {view: "template", width: 50, borderless: true};

			this._tableActivities = new ActivitiesTableView(this.app, true);
			const activitiesTab = {
				id: "activitiesTab",
				rows: [
					this._tableActivities,
					{view: "button", label: "Add activity", click: () => this._activityPopup.showPopup({ContactID: this._contactId})}
				]
			};

			this._tableFiles = new FilesTableView(this.app);
			const uploader = {
				view: "uploader",
				localId: "uploader",
				label: "Upload",
				autosend: false
			};
			const filesTab = {
				id: "filesTab",
				rows: [
					this._tableFiles,
					uploader
				]
			};

			const tabs = {
				rows: [
					{
						type: "clean",
						rows: [
							{
								borderless: true,
								view: "tabbar",
								id: "tabbar",
								value: "activitiesTab",
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
		const uploader = this.$$("uploader");
		uploader.attachEvent("onAfterFileAdd", () => {
			uploader.files.data.each((file) => {
				const fileObject = {
					name: file.name,
					lastModifiedDate: file.file.lastModifiedDate,
					size: file.sizetext,
					contactId: this._contactId
				};
				filesCollection.add(fileObject);
			});
			uploader.files.data.clearAll();
		});
	}

	urlChange(view, url) {
		if (url[0].page === "contacts.info") {
			this._contactId = url[0].params.id;
			if (this._contactId) {
				this.showContact(this._contactId);
				filesCollection.filter("TypeID", this._contactId);
			}
		}
	}

	showContact(id) {
		const contact = contactsCollection.getItem(id);

		if (!contact) return;

		const name = this.$$("name");
		name.define("label", `${contact.FirstName} ${contact.LastName}`);
		name.refresh();

		const keys = Object.keys(contact).filter(key => key !== "id" && !key.includes("$") && key !== "name");
		keys.forEach((key) => {
			const obj = this.$$(key);
			if (obj) {
				if (key === "StatusID" && +contact[key] !== 0 && contact[key]) {
					const status = statusesCollection.getItem(contact[key]).Value;
					obj.define("label", status);
				}
				else {
					obj.define("label", contact[key]);
				}
				if (key === "Birthday" && contact[key].length > 10) {
					obj.define("label", contact.Birthday.substring(0, contact.Birthday.length - 6));
				}
				obj.refresh();
			}
		});
		this._tableActivities.showData(this._contactId);
	}

	createIconTemplate(icon) {
		return `<div style='display:flex;align-items: center;;'>
					<span style='display:inline' class='${icon}'></span>&nbsp;#label#
				</div>`;
	}

	_removeContact() {
		webix.confirm("Are you sure you want to delete this item permanently?").then(() => {
			contactsCollection.remove(self._contactId);
		});
	}
}
