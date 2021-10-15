import {JetView} from "webix-jet";

import {DATE_FORMAT_F} from "../../helpers";
import filesCollection from "../../models/files";

export default class FilesTableView extends JetView {
	config() {
		return {
			localId: "table",
			view: "datatable",
			columns: [
				{id: "name", header: "Name", minWidth: 150, sort: "text", fillspace: true},
				{id: "lastModifiedDate", header: "Change date", minWidth: 150, width: 250, sort: "date", format: webix.Date.dateToStr(DATE_FORMAT_F)},
				{id: "size", header: "Size", minWidth: 150, sort: "text"},
				{id: "delete", header: "", template: "{common.trashIcon()}", width: 40}
			],
			onClick: {
				"wxi-pencil": (e, obj) => {
					const object = filesCollection.getItem(obj);
					this._activityPopup.showPopup(object);
					return false;
				},
				"wxi-trash": (e, obj) => {
					webix.confirm("Are you sure you want to delete this item permanently?").then(() => {
						filesCollection.remove(obj);
					});
					return false;
				}
			},
			select: "row"
		};
	}

	init() {
		this.$$("table").sync(filesCollection);
	}
}
