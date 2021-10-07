import activitiesCollection from "../../models/activities";
import activityTypes from "../../models/activityTypes";
import contactsCollection from "../../models/contacts";

const popup = webix.ui({
	id: "activity_popup",
	modal: true,
	view: "popup",
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
			{view: "text", label: "Details", height: 70, name: "details"},
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
						const values = webix.$$("popup_form").getValues();

						const date = webix.Date.dateToStr("%Y-%m-%d")(values.date);

						const time = webix.Date.dateToStr("%H:%i")(values.time);
						const newDate = `${date} ${time}`;
						values.date = newDate;

						if (values.time) {
							delete values.time;
						}

						if (!values.id) {
							activitiesCollection.add(values);
						}
						else {
							activitiesCollection.updateItem(values.id, values);
						}
						webix.$$("popup_form").clear();
						webix.$$("activity_popup").hide();
					}
				},
				{
					view: "button",
					label: "Cancel",
					click() {
						webix.$$("popup_form").clear();
						webix.$$("activity_popup").hide();
					}
				}
			]}
		]
	}
});

export default popup;
