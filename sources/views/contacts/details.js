import BaseView from "../../BaseView";
import {DATE_FORMAT_M, SERVER_FORMAT} from "../../helpers";
import contactsCollection from "../../models/contacts";
import statusesCollection from "../../models/statuses";

export default class DetailsView extends BaseView {
	config() {
		const header = {view: "label", localId: "name", label: this._("Edit contact"), css: "label-info-name"};

		const maxWidth = 450;
		const labelWidth = 150;
		const col1 = {
			minWidth: 200,
			margin: 15,
			rows: [
				{view: "text", label: this._("First name"), name: "FirstName", maxWidth, labelWidth},
				{view: "text", label: this._("Last name"), name: "LastName", maxWidth, labelWidth},
				{view: "datepicker", label: this._("Joining date"), name: "StartDate", maxWidth, labelWidth, format: DATE_FORMAT_M},
				{view: "combo", label: this._("Status"), name: "StatusID", maxWidth, labelWidth, options: {body: {data: statusesCollection, template: "#Value#"}}},
				{view: "text", label: this._("Job"), name: "Job", maxWidth, labelWidth},
				{view: "text", label: this._("Company"), name: "Company", maxWidth, labelWidth},
				{view: "text", label: this._("Website"), name: "Website", maxWidth, labelWidth},
				{view: "text", label: this._("Address"), name: "Address", maxWidth, labelWidth}
			]
		};

		const col2 = {
			minWidth: 200,
			margin: 15,
			rows: [
				{view: "text", label: this._("Email"), name: "Email", maxWidth, labelWidth},
				{view: "text", label: this._("Skype"), name: "Skype", maxWidth, labelWidth},
				{view: "text", label: this._("Phone"), name: "Phone", maxWidth, labelWidth},
				{view: "datepicker", label: this._("Birthday"), name: "Birthday", maxWidth, labelWidth, format: DATE_FORMAT_M},
				{
					borderless: true,
					cols: [
						{view: "template", localId: "image", template: "<img style='object-fit: fill; height: 200px' src='#src#' alt='Image'></img>", height: 200, borderless: true},
						{
							borderless: true,
							margin: 10,
							paddingX: 10,
							rows: [
								{},
								{view: "uploader", localId: "uploader", label: this._("Change photo"), autosend: false, maxWidth: 250, accept: "image/jpeg, image/png"},
								{view: "button", label: this._("Delete photo"), maxWidth: 250, click: this.onPhotoDelete}
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
					label: this._("Cancel"),
					width: 150,
					click: () => this.app.callEvent("onAfterDetailsInfoClosed", [this._contactId])
				},
				{
					view: "button",
					label: this._("Save"),
					maxWidth: 250,
					localId: "button_add",
					click: this.onSave
				}
			]
		};

		const maxLength = 30;
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
				Email: this.webix.rules.isEmail
			}
		};

		return {padding: 15, rows: [header, form]};
	}

	init() {
		const uploader = this.$$("uploader");
		const self = this;

		uploader.attachEvent("onAfterFileAdd", () => {
			const fileId = uploader.files.getFirstId();
			const file = uploader.files.getItem(fileId).file;

			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = () => {
				const dataUrl = reader.result;
				self._photoBuffer = dataUrl;
				self.$$("image").setValues({src: dataUrl});
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
			this.$scope._photoBuffer = "";
			this.$scope.$$("image").setValues({src: ""});
		}
		else {
			this.$scope.webix.message({type: "error", text: this._("Loading error")});
		}
	}

	onSave() {
		const form = this.$scope.$$("form");
		const object = form.getValues();
		if (!form.validate()) return;

		object.Photo = this.$scope._photoBuffer;

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
		this.$$("image").setValues({src: item.Photo});
		this._photoBuffer = item.Photo;
	}

	showAsAddingForm() {
		const value = this._("Add contact");
		const property = "label";

		const name = this.$$("name");
		name.define(property, value);
		name.refresh();

		const button = this.$$("button_add");
		button.define(property, value);
		button.refresh();
	}
}
