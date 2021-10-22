import BaseView from "../../BaseView";
import {DATE_FORMAT_F, STATUSES} from "../../helpers";
import activitiesCollection from "../../models/activities";
import activityTypes from "../../models/activityTypes";
import contactsCollection from "../../models/contacts";

export default class ActivityPopup extends BaseView {
	config() {
		return {
			localId: "activity_popup",
			modal: true,
			view: "window",
			width: 600,
			position: "center",
			head: {template: this._("Add"), localId: "header"},
			body: {
				view: "form",
				localId: "popup_form",
				align: "center",
				padding: 10,
				margin: 10,
				elements: [
					{view: "textarea", label: this._("Details"), name: "Details"},
					{view: "combo", options: activityTypes, label: this._("Type"), name: "TypeID"},
					{view: "combo", options: {body: {data: contactsCollection, template: "#FirstName# #LastName#"}}, label: this._("Contact"), name: "ContactID", localId: "contactID"},
					{
						cols: [
							{view: "datepicker", label: this._("Date"), name: "DueDate", format: DATE_FORMAT_F},
							{
								view: "datepicker",
								localId: "time",
								width: 300,
								type: "time",
								value: "12:00 AM",
								label: this._("Time"),
								labelWidth: 100,
								suggest: {
									type: "timeboard",
									body: {
										button: true
									}
								},
								name: "time"
							}
						]
					},
					{view: "checkbox", label: this._("Completed"), name: "State", checkValue: STATUSES.CLOSE, uncheckValue: STATUSES.OPEN},
					{cols: [
						{},
						{view: "button", label: this._("Add"), localId: "button_add", click: () => this.buttonAddClick()},
						{view: "button", label: this._("Cancel"), click: this.onCancel}
					]}
				],
				rules: {
					TypeID: this.webix.rules.isNotEmpty,
					ContactID: this.webix.rules.isNotEmpty
				}
			}
		};
	}

	onCancel() {
		const form = this.$scope.$$("popup_form");
		form.clear();
		form.clearValidation();
		this.$scope.getRoot().hide();
	}

	buttonAddClick() {
		const form = this.$$("popup_form");
		if (!form.validate()) {
			return;
		}
		const values = form.getValues();

		if (values.DueDate && values.time) {
			const h = values.time.getHours();
			const m = values.time.getMinutes();
			values.DueDate.setHours(h);
			values.DueDate.setMinutes(m);
		}

		if (values.time) {
			delete values.time;
		}

		if (!values.id) {
			try {
				activitiesCollection.add(values);
			}
			catch (ex) {
				webix.message({type: "error", text: ex.message});
			}
		}
		else {
			activitiesCollection.updateItem(values.id, values);
		}
		form.clear();
		form.clearValidation();
		this.getRoot().hide();
		// this.app.callEvent("onActivitiesCollectionUpdated", []);
	}

	disableContactCombo() {
		const combo = this.$$("contactID");
		combo.disable();
	}

	showPopup(object, isEdit) {
		const popup = this.getRoot();
		if (!popup) {
			return;
		}
		const buttonName = isEdit ? this._("Save") : this._("Add");
		const popupHeader = isEdit ? this._("Edit activity") : this._("Add activity");
		if (object) {
			if (object.DueDate && webix.isDate(object.DueDate)) {
				const h = object.DueDate.getHours();
				const m = object.DueDate.getMinutes();
				object.time = `${h}:${m}`;
			}
			this.$$("popup_form").setValues(object);
		}

		const button = this.$$("button_add");
		const header = this.$$("header");

		header.define("template", popupHeader);
		button.define("label", buttonName);

		header.refresh();
		button.refresh();

		popup.show();
	}
}
