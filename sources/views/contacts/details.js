import {JetView} from "webix-jet";

import {DATE_FORMAT_M, SERVER_FORMAT} from "../../helpers";
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
				{view: "datepicker", label: "Joining date", name: "StartDate", maxWidth, labelWidth, format: DATE_FORMAT_M},
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
				{view: "datepicker", label: "Birthday", name: "Birthday", maxWidth, labelWidth, format: DATE_FORMAT_M},
				{
					borderless: true,
					cols: [
						{view: "template", localId: "image", css: "contact-image", template: "<img src='#src#'></img>", height: 200},
						{
							margin: 10,
							paddingX: 10,
							rows: [
								{},
								{
									view: "uploader",
									localId: "uploader",
									label: "Change photo",
									autosend: false,
									width: 150
								},
								{view: "button", label: "Delete photo", width: 150, click: this.onPhotoDelete}
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
					click: () => this.app.callEvent("onAfterDetailsInfoClosed", [this._contactId])
				},
				{
					view: "button",
					label: "Save",
					width: 150,
					localId: "button_add",
					click: this.onSave
				}
			]
		};

		const maxLength = 15;
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
				FirstName: val => !!val && val.length < maxLength,
				LastName: val => !!val && val.length < maxLength,
				Email: val => !!val && val.length < maxLength
			}
		};

		return {padding: 15, rows: [header, form]};
	}

	init() {
		const uploader = this.$$("uploader");
		uploader.attachEvent("onAfterFileAdd", () => {
			const fileId = uploader.files.getFirstId();
			const file = uploader.files.getItem(fileId).file;

			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = () => {
				const dataUrl = reader.result;
				const toUpdate = contactsCollection.getItem(this._contactId);
				toUpdate.Photo = dataUrl;

				contactsCollection.updateItem(this._contactId, toUpdate);

				this.$$("image").define("src", file);
			};
			reader.onerror = (error) => {
				this.webix.message({type: "error", text: error});
			};
			uploader.files.data.clearAll();
		});
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

	onPhotoDelete() {
		const item = contactsCollection.getItem(this.$scope._contactId);
		if (item) {
			item.Photo = "";
			contactsCollection.waitSave(() => {
				contactsCollection.updateItem(this.$scope._contactId, item);
			}).then(() => {
				this.$scope.webix.message("Photo deleted!");
			});
		}
		else {
			this.$scope.webix.message({type: "error", text: "load error"});
		}
	}

	onSave() {
		const form = this.$scope.$$("form");
		const object = form.getValues();

		if (!form.validate()) return;

		const formatter = webix.Date.dateToStr(SERVER_FORMAT);
		object.StartDate = formatter(object.StartDate);
		object.Birthday = formatter(object.Birthday);

		if (object.id) {
			contactsCollection.updateItem(object.id, object);
			this.$scope.app.callEvent("onAfterDetailsInfoClosed", [object.id]);
		}
		else {
			contactsCollection.waitSave(() => {
				contactsCollection.add(object);
			}).then((result) => {
				object.id = result.id;
				this.$scope.app.callEvent("onAfterDetailsInfoClosed", [object.id]);
			});
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
