import {JetView} from "webix-jet";

import activitiesCollection from "../models/activities";
import activityTypes from "../models/activityTypes";
import contactsCollection from "../models/contacts";

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
					pf(popup);
					popup.show();
				}
			};

			const table = {
				localId: "table",
				view: "datatable",
				columns: [
					{id: "completed", header: "", template: "{common.checkbox()}", minWidth: 150},
					{id: "typeId", header: ["Activity type", {content: "selectFilter"}], minWidth: 150, collection: activityTypes, sort: "text"},
					{id: "date", header: ["Due date", {content: "textFilter"}], minWidth: 150, sort: "date"},
					{id: "details", header: ["Details", {content: "textFilter"}], minWidth: 150, sort: "text"},
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
						fillPopup(popup, item);
						popup.show();
						return false;
					},
					"wxi-trash": function (e, obj) {
						webix.confirm("Are you sure?").then(() => {
							this.remove(obj);
						});
						return false;
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
		this.$$("table").parse(activitiesCollection);
	}
}

function fillPopup(popup, object) {
	console.log(object);
	popup.queryView({localId: "type"}).define("value", object.typeId);
	popup.queryView({localId: "type"}).refresh();
	popup.queryView({localId: "contact"}).define("value", object.contactId);
	popup.queryView({localId: "date"}).define("value", object.date);
	popup.queryView({localId: "time"}).define("value", object.time);
	popup.queryView({localId: "details"}).define("value", object.details);
	popup.queryView({localId: "completed"}).define("value", object.completed);
}

webix.ui({
	id: "activity_popup",
	modal: true,
	view: "popup",
	width: 600,
	position: "center",
	body: {
		align: "center",
		padding: 10,
		margin: 10,
		rows: [
			{type: "header", template: "Add activity", borderless: true, css: "popup-header"},
			{view: "text", label: "Details", height: 70, localId: "details"},
			{view: "combo", options: activityTypes, label: "Type", localId: "type"},
			{view: "combo", options: {body: {data: contactsCollection, template: "#name# #surname#"}}, label: "Contact", localId: "contact"},
			{
				cols: [
					{view: "datepicker", label: "Date", localId: "time"},
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
						localId: "date"
					}
				]
			},
			{view: "checkbox", label: "Completed", localId: "completed"},
			{cols: [
				{},
				{view: "button", label: "Add"},
				{view: "button", label: "Cancel", click: () => webix.$$("activity_popup").hide()}
			]}
		]
	}
});
