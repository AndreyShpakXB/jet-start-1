import {JetView} from "webix-jet";

import {dateFormat, serverFormat} from "../../helpers";
import activitiesCollection from "../../models/activities";
import activityTypes from "../../models/activityTypes";
import contactsCollection from "../../models/contacts";
import ActivityPopup from "./activityPopup";

export default class ActivitiesTableView extends JetView {
	constructor(app, hide) {
		super(app);
		if (hide) {
			this._hideData = true;
		}
		else {
			this._hideData = false;
		}
	}

	config() {
		return this.webix.promise.all([
			contactsCollection.waitData,
			activityTypes.waitData
		]).then(() => {
			const table = {
				localId: "table",
				view: "datatable",
				columns: [
					{id: "State", checkValue: "Close", uncheckValue: "Open", header: "", template: "{common.checkbox()}", width: 40},
					{id: "TypeID", header: ["Activity type", {content: "selectFilter"}], minWidth: 150, collection: activityTypes, sort: "text"},
					{
						id: "DueDate",
						minWidth: 150,
						width: 250,
						header: [
							"Due date",
							{
								content: "datepickerFilter",
								inputConfig: {format: webix.Date.dateToStr(dateFormat)},
								compare(cell, filter) {
									const date1 = webix.Date.dayStart(cell).getTime();
									const date2 = webix.Date.dayStart(filter).getTime();
									return date1 === date2;
								}
							}],
						sort: "date",
						format: webix.Date.dateToStr(dateFormat)
					},
					{id: "Details", header: ["Details", {content: "textFilter"}], minWidth: 150, sort: "text", fillspace: true},
					{
						id: "ContactID",
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
						const object = activitiesCollection.getItem(obj);
						this._activityPopup.showPopup(object);
						return false;
					},
					"wxi-trash": (e, obj) => {
						webix.confirm("Are you sure you want to delete this item permanently?").then(() => {
							activitiesCollection.remove(obj);
						});
						return false;
					}
				},
				select: "row"
			};
			return table;
		});
	}

	init() {
		this._activityPopup = this.ui(ActivityPopup);
		const table = this.$$("table");
		if (!this._hideData) {
			table.sync(activitiesCollection);
			activitiesCollection.filter("ContactID", "");
		}
		this.on(activitiesCollection.data, "onStoreUpdated", () => {
			table.filterByAll();
		});
		const processor = webix.dp(activitiesCollection);
		if (processor && !processor.hasEvent("onBeforeDataSend")) {
			processor.attachEvent("onBeforeDataSend",
			(details) => {
				details.data.DueDate = webix.Date.dateToStr(serverFormat)(details.data.DueDate);
			});
		}
	}

	showData(id) {
		const table = this.$$("table");
		if (id) {
			if (!table.getColumnConfig("ContactID").hidden) {
				table.hideColumn("ContactID");
			}
			activitiesCollection.filter("ContactID", id);
		}
		else {
			activitiesCollection.filter("ContactID", "");
		}
		table.sync(activitiesCollection);
		this._hideData = false;
	}

	clearContactId() {
		const table = this.$$("table");
		if (table.getColumnConfig("ContactID").hidden) {
			table.showColumn("ContactID");
		}
	}

	unselectAll() {
		this.$$("table").unselectAll();
	}
}
