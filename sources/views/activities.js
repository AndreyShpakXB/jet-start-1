import {JetView} from "webix-jet";

import activitiesCollection from "../models/activities";
import activityTypes from "../models/activityTypes";
import contactsCollection from "../models/contacts";
import popup from "./activities/popup";

const dateFormat = "%d %F %Y";

function showPopup(object, table) {
	const buttonName = object ? "Save" : "Add";
	const popupHeader = object ? "Edit activity" : "Add activity";
	if (object) {
		const formatted = Object.assign({}, object);
		if (formatted.date) {
			formatted.time = formatted.date.substring(formatted.date.length - 5);
		}
		webix.$$("popup_form").setValues(formatted);
	}
	else if (table) {
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
			const addButton = {
				localId: "buttonAdd",
				view: "button",
				type: "icon",
				icon: "fa-plus-square",
				label: "Add activity",
				width: 150,
				click() {
					showPopup(null, this.$scope.$$("table"));
				}
			};

			contactsCollection.data.each((val) => {
				if (!val.value) {
					val.value = `${val.name} ${val.surname}`;
				}
			});
			const self = this;
			const table = {
				localId: "table",
				view: "datatable",
				scheme: {
					$init(obj) {
						if (obj.date) {
							obj.date = webix.Date.strToDate(dateFormat)(obj.date);
						}
					}
				},
				columns: [
					{id: "completed", header: "", template: "{common.checkbox()}", minWidth: 150},
					{id: "typeId", header: ["Activity type", {content: "selectFilter"}], minWidth: 150, collection: activityTypes, sort: "text"},
					{
						id: "date",
						minWidth: 150,
						width: 250,
						header: ["Due date", {content: "textFilter"}],
						format: webix.Date.dateToStr(dateFormat),
						sort: "date"
					},
					{id: "details", header: ["Details", {content: "textFilter"}], minWidth: 150, sort: "text", fillspace: true},
					{
						id: "contactId",
						header: ["Contact", {content: "selectFilter"}],
						minWidth: 150,
						collection: contactsCollection,
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
					"wxi-pencil": (e, obj) => {
						const item = activitiesCollection.getItem(obj);
						showPopup(item, self.$$("table"));
						return false;
					},
					"wxi-trash": (e, obj) => {
						webix.confirm("Are you sure you want to delete this item permanently?").then(() => {
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
		try {
			this.$$("table").sync(activitiesCollection);
		}
		catch (ex) {
			this.webix.message({type: "error", text: ex.message});
		}
	}
}
