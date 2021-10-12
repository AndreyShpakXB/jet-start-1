import {JetView} from "webix-jet";

import {dateFormat, serverFormat} from "../../helpers";
import activitiesCollection from "../../models/activities";
import activityTypes from "../../models/activityTypes";
import contactsCollection from "../../models/contacts";
import ActivityPopup from "./activityPopup";

export default class ActivitiesTableView extends JetView {
	constructor(app, contactId) {
		super(app);
		if (contactId) {
			this._contactId = contactId;
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
						sort: "text",
						hidden: !!this._contactId
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
						this._activityPopup.showPopup(obj);
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
		try {
			table.sync(activitiesCollection);
		}
		catch (ex) {
			this.webix.message({type: "error", text: ex.message});
		}
		this.on(activitiesCollection.data, "onStoreUpdated", () => {
			table.filterByAll();
		});
		const processor = webix.dp(activitiesCollection);
		if (processor) {
			processor.attachEvent("onBeforeDataSend",
			(details) => {
				details.data.DueDate = webix.Date.dateToStr(serverFormat)(details.data.DueDate);
			});
		}
	}

	unselectAll() {
		this.$$("table").unselectAll();
	}
}
