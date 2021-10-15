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
				{id: "size", header: "Size", minWidth: 150, sort: "int", template: "#sizetext#"},
				{id: "delete", header: "", template: "{common.trashIcon()}", width: 40}
			],
			onClick: {
				"wxi-pencil": this.onEdit,
				"wxi-trash": this.onDelete
			},
			select: "row"
		};
	}

	onEdit(e, obj) {
		const object = filesCollection.getItem(obj);
		this.$scope._activityPopup.showPopup(object);
		return false;
	}

	onDelete(e, obj) {
		webix.confirm("Are you sure you want to delete this item permanently?").then(() => {
			filesCollection.remove(obj);
		});
		return false;
	}

	init() {
		this.$$("table").sync(filesCollection);
	}
}
