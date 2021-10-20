import {JetView} from "webix-jet";

import {DATE_FORMAT_F, SERVER_FORMAT} from "../../helpers";
import activitiesCollection from "../../models/activities";
import activityTypes from "../../models/activityTypes";
import contactsCollection from "../../models/contacts";
import ActivityPopup from "./activityPopup";

export default class ActivitiesTableView extends JetView {
	constructor(app, hide) {
		super(app);
		this._hideData = !!hide;
	}

	config() {
		const _ = this.app.getService("locale")._;
		return this.webix.promise.all([
			contactsCollection.waitData,
			activityTypes.waitData
		]).then(() => {
			const table = {
				localId: "table",
				view: "datatable",
				columns: [
					{id: "State", checkValue: "Close", uncheckValue: "Open", header: "", template: "{common.checkbox()}", width: 40},
					{id: "TypeID", header: [_("Activity type"), {content: "selectFilter"}], minWidth: 150, collection: activityTypes, sort: "text"},
					{
						id: "DueDate",
						minWidth: 150,
						width: 250,
						header: [_("Due date"), {content: "datepickerFilter", inputConfig: {format: webix.Date.dateToStr(DATE_FORMAT_F)}, compare: this.dateCompare}],
						sort: "date",
						format: webix.Date.dateToStr(DATE_FORMAT_F)
					},
					{id: "Details", header: [_("Details"), {content: "textFilter"}], minWidth: 150, sort: "text", fillspace: true},
					{
						id: "ContactID",
						header: [_("Contact"), {content: "selectFilter"}],
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
					"wxi-pencil": this.onEdit,
					"wxi-trash": this.onDelete
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
				details.data.DueDate = webix.Date.dateToStr(SERVER_FORMAT)(details.data.DueDate);
			});
		}
	}

	urlChange(view, url) {
		if (url[0].page === "contacts.info") {
			const id = this.getParam("id");
			this.showData(id);
		}
	}

	onEdit(e, obj) {
		const object = activitiesCollection.getItem(obj);
		if (this.$scope._hideData) {
			this.$scope._activityPopup.disableContactCombo();
		}
		this.$scope._activityPopup.showPopup(object, true);
		return false;
	}

	onDelete(e, obj) {
		const _ = this.$scope.app.getService("locale")._;
		const info = {
			title: _("Confirmation"),
			text: _("Are you sure you want to delete this item permanently?"),
			ok: _("OK"),
			cancel: _("Cancel")
		};
		webix.confirm(info).then(() => {
			activitiesCollection.remove(obj);
		});
		return false;
	}

	dateCompare(cell, filter) {
		const date1 = webix.Date.dayStart(cell);
		const date2 = webix.Date.dayStart(filter);
		return webix.Date.equal(date1, date2);
	}

	showData(id) {
		activitiesCollection.waitData.then(() => {
			const table = this.$$("table");
			if (id) {
				if (table.isColumnVisible("ContactID")) {
					table.hideColumn("ContactID");
				}
				activitiesCollection.filter(obj => +obj.ContactID === +id);
			}
			else {
				activitiesCollection.filter("ContactID", "");
			}
			table.sync(activitiesCollection);
			table.filterByAll();
		});
	}
}
