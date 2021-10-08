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
			body: {
				view: "form",
				id: "popup_form",
				align: "center",
				padding: 10,
				margin: 10,
				elements: [
					{type: "header", template: "Add activity", borderless: true, css: "popup-header", localId: "header"},
					{view: "textarea", label: "Details", name: "details"},
					{view: "combo", options: activityTypes, label: "Type", name: "typeId"},
					{view: "combo", options: {body: {data: contactsCollection, template: "#name# #surname#"}}, label: "Contact", name: "contactId"},
					{
						cols: [
							{view: "datepicker", label: "Date", name: "date", format: "%d %F %Y"},
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
					{view: "checkbox", label: "Completed", name: "completed"},
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

								if (values.date) {
									const date = webix.Date.dateToStr("%Y-%m-%d")(values.date);
									const time = webix.Date.dateToStr("%H:%i")(values.time);
									const newDate = `${date} ${time}`;
									values.date = newDate;
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
								webix.$$("activity_popup").hide();
							}
						},
						{
							view: "button",
							label: "Cancel",
							click() {
								const form = webix.$$("popup_form");
								form.clear();
								form.clearValidation();
								webix.$$("activity_popup").hide();
							}
						}
					]}
				],
				rules: {
					typeId: this.webix.rules.isNotEmpty,
					contactId: this.webix.rules.isNotEmpty
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
			if (formatted.date) {
				formatted.time = formatted.date.substring(formatted.date.length - 5);
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
