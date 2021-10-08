import {JetView} from "webix-jet";

import activitiesCollection from "../models/activities";
import activityTypes from "../models/activityTypes";
import contactsCollection from "../models/contacts";
import ActivityPopup from "./activities/activityPopup";

const dateFormat = "%d %F %Y";

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
					this.$scope.$$("table").unselectAll();
					this.$scope._activityPopup.showPopup(null);
				}
			};

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
					{id: "completed", header: "", template: "{common.checkbox()}", width: 40},
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
						this._activityPopup.showPopup(item);
						return false;
					},
					"wxi-trash": (e, obj) => {
						webix.confirm("Are you sure you want to delete this item permanently?").then(() => {
							activitiesCollection.remove(obj);
						});
						return false;
					}
				},
				// on: {
				// 	onCheck(id) {

				// 	}
				// },
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
		this._activityPopup = this.ui(ActivityPopup);
		try {
			this.$$("table").sync(activitiesCollection);
		}
		catch (ex) {
			this.webix.message({type: "error", text: ex.message});
		}
	}
}
