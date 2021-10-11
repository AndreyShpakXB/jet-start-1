import {JetView} from "webix-jet";

import activitiesCollection from "../../models/activities";
import activityTypes from "../../models/activityTypes";
import contactsCollection from "../../models/contacts";

export default class ActivityPopup extends JetView {
	config() {
		return {
			id: "activity_popup",
			modal: true,
			view: "window",
			width: 600,
			position: "center",
			head: {template: "Add", localId: "header"},
			body: {
				view: "form",
				id: "popup_form",
				align: "center",
				padding: 10,
				margin: 10,
				elements: [
					{view: "textarea", label: "Details", name: "Details"},
					{view: "combo", options: activityTypes, label: "Type", name: "TypeID"},
					{view: "combo", options: {body: {data: contactsCollection, template: "#FirstName# #LastName#"}}, label: "Contact", name: "ContactID"},
					{
						cols: [
							{view: "datepicker", label: "Date", name: "DueDate", format: "%d %F %Y"},
							{
								view: "datepicker",
								localId: "time",
								width: 300,
								type: "time",
								value: "10:00",
								label: "Time",
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
					{view: "checkbox", label: "Comlpeted", name: "State", checkValue: "Close", uncheckValue: "Open"},
					{cols: [
						{},
						{
							view: "button",
							label: "Add",
							localId: "button_add",
							click() {
								const form = webix.$$("popup_form");
								if (!form.validate()) {
									return;
								}
								const values = form.getValues();

								if (values.DueDate) {
									const date = webix.Date.dateToStr("%Y-%m-%d")(values.DueDate);
									const time = webix.Date.dateToStr("%H:%i")(values.time);
									const newDate = `${date} ${time}`;
									values.DueDate = newDate;
								}

								if (values.time) {
									delete values.time;
								}

								if (!values.id) {
									try {
										activitiesCollection.waitSave(() => {
											activitiesCollection.add(values);
										}).then(() => {
											this.$scope.app.callEvent("onTableActivitiesUpdated", []);
										});
									}
									catch (ex) {
										webix.message({type: "error", text: ex.message});
									}
								}
								else {
									activitiesCollection.waitSave(() => {
										activitiesCollection.updateItem(values.id, values);
									}).then(() => {
										this.$scope.app.callEvent("onTableActivitiesUpdated", []);
									});
								}
								form.clear();
								form.clearValidation();
								this.$scope.getRoot().hide();
							}
						},
						{
							view: "button",
							label: "Cancel",
							click() {
								const form = webix.$$("popup_form");
								form.clear();
								form.clearValidation();
								this.$scope.getRoot().hide();
							}
						}
					]}
				],
				rules: {
					TypeID: this.webix.rules.isNotEmpty,
					ContactID: this.webix.rules.isNotEmpty
				}
			}
		};
	}

	destroy() {
		this.getRoot().close();
	}

	showPopup(object) {
		const popup = this.getRoot();
		if (!popup) {
			return;
		}
		const buttonName = object ? "Save" : "Add";
		const popupHeader = object ? "Edit activity" : "Add activity";
		if (object) {
			const formatted = Object.assign({}, object);
			if (formatted.DueDate) {
				formatted.time = formatted.DueDate.substring(formatted.DueDate.length - 5);
			}
			webix.$$("popup_form").setValues(formatted);
		}

		const button = popup.queryView({localId: "button_add"});
		const header = popup.queryView({localId: "header"});

		header.define("template", popupHeader);
		button.define("label", buttonName);

		header.refresh();
		button.refresh();

		popup.show();
	}
}
