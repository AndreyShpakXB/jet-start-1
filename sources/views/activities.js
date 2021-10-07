import {JetView} from "webix-jet";

import activitiesCollection from "../models/activities";
import activityTypes from "../models/activityTypes";
import contactsCollection from "../models/contacts";

function showPopup(popup, object, table) {
	const buttonName = object ? "Save" : "Add";
	const popupHeader = object ? "Edit activity" : "Add activity";

	if (object) {
		const formatted = Object.assign({}, object);
		formatted.date = webix.Date.strToDate("%d %F %Y")(formatted.date);
		webix.$$("popup_form").setValues(formatted);
	}
	if (table) {
		table.unselectAll();
	}

	const button = popup.queryView({localId: "button_add"});
	const header = popup.queryView({localId: "header"});

	header.define("template", popupHeader);
	button.define("label", buttonName);

	header.refresh();
	button.refresh();

	popup.show();
}

export default class ActivitiesView extends JetView {
	config() {
		return this.webix.promise.all([
			contactsCollection.waitData,
			activityTypes.waitData
		]).then(() => {
			const popup = this.webix.$$("activity_popup");
			const addButton = {
				localId: "buttonAdd",
				view: "button",
				type: "icon",
				icon: "fa-plus-square",
				label: "Add activity",
				width: 150,
				click() {
					showPopup(popup, null, this.$scope.$$("table"));
				}
			};

			const table = {
				localId: "table",
				view: "datatable",
				columns: [
					{id: "completed", header: "", template: "{common.checkbox()}", minWidth: 150},
					{id: "typeId", header: ["Activity type", {content: "selectFilter"}], minWidth: 150, collection: activityTypes, sort: "text"},
					{id: "date", header: ["Due date", {content: "textFilter"}], minWidth: 150, width: 250, sort: "date"},
					{id: "details", header: ["Details", {content: "textFilter"}], minWidth: 150, sort: "text", fillspace: true},
					{
						id: "contactId",
						header: ["Contact", {content: "selectFilter"}],
						minWidth: 150,
						collection: {config: {data: contactsCollection, template: "#name#"}},
						template(obj) {
							const cont = contactsCollection.getItem(obj.contactId);
							return `${cont.name} ${cont.surname}`;
						},
						fillspace: true,
						sort: "text"
					},
					{
						id: "edit",
						header: "",
						template: "<span class='webix_icon wxi-pencil'></span>",
						width: 40
					},
					{
						id: "delete",
						header: "",
						template: "{common.trashIcon()}",
						width: 40
					}
				],
				onClick: {
					"wxi-pencil": function (e, obj) {
						const item = activitiesCollection.getItem(obj);
						showPopup(popup, item, this.$scope.$$("table"));
						return false;
					},
					"wxi-trash": function (e, obj) {
						webix.confirm("Are you sure?").then(() => {
							activitiesCollection.remove(obj);
						});
						return false;
					}
				},
				on: {
					onCheck(id) {
						const item = activitiesCollection.getItem(id);
						activitiesCollection.updateItem(id, item);
					}
				},
				select: "row"
			};

			return {
				margin: 10,
				padding: 10,
				rows: [
					{cols: [{}, addButton]},
					table
				]
			};
		});
	}

	init() {
		this.$$("table").sync(activitiesCollection);
	}
}

webix.ui({
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
						values.date = webix.Date.dateToStr("%d %F %Y")(values.date);
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
