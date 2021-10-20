import {JetView} from "webix-jet";

import {DATE_FORMAT_F} from "../../helpers";
import activitiesCollection from "../../models/activities";
import activityTypes from "../../models/activityTypes";
import contactsCollection from "../../models/contacts";

export default class ActivityPopup extends JetView {
	config() {
		const _ = this.app.getService("locale")._;
		return {
			localId: "activity_popup",
			modal: true,
			view: "window",
			width: 600,
			position: "center",
			head: {template: _("Add"), localId: "header"},
			body: {
				view: "form",
				localId: "popup_form",
				align: "center",
				padding: 10,
				margin: 10,
				elements: [
					{view: "textarea", label: _("Details"), name: "Details"},
					{view: "combo", options: activityTypes, label: _("Type"), name: "TypeID"},
					{view: "combo", options: {body: {data: contactsCollection, template: "#FirstName# #LastName#"}}, label: _("Contact"), name: "ContactID", localId: "contactID"},
					{
						cols: [
							{view: "datepicker", label: _("Date"), name: "DueDate", format: DATE_FORMAT_F},
							{
								view: "datepicker",
								localId: "time",
								width: 300,
								type: "time",
								value: "12:00 AM",
								label: _("Time"),
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
					{view: "checkbox", label: _("Completed"), name: "State", checkValue: "Close", uncheckValue: "Open"},
					{cols: [
						{},
						{view: "button", label: _("Add"), localId: "button_add", click: () => this.buttonAddClick()},
						{view: "button", label: _("Cancel"), click: this.onCancel}
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
	}

	disableContactCombo() {
		const combo = this.$$("contactID");
		combo.disable();
	}

	showPopup(object, isEdit) {
		const _ = this.app.getService("locale")._;
		const popup = this.getRoot();
		if (!popup) {
			return;
		}
		const buttonName = isEdit ? _("Save") : _("Add");
		const popupHeader = isEdit ? _("Edit activity") : _("Add activity");
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
