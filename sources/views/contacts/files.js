import BaseView from "../../BaseView";
import {DATE_FORMAT_F} from "../../helpers";
import filesCollection from "../../models/files";

export default class FilesTableView extends BaseView {
	config() {
		return {
			localId: "table",
			view: "datatable",
			columns: [
				{id: "name", header: this._("Name"), minWidth: 150, sort: "text", fillspace: true},
				{id: "lastModifiedDate", header: this._("Change date"), minWidth: 150, width: 250, sort: "date", format: webix.Date.dateToStr(DATE_FORMAT_F)},
				{id: "size", header: this._("Size"), minWidth: 150, sort: "int", template: "#sizetext#"},
				{id: "delete", header: "", template: "{common.trashIcon()}", width: 40}
			],
			onClick: {
				"wxi-trash": () => this.onDelete()
			},
			select: "row"
		};
	}

	onDelete(e, obj) {
		const info = {
			title: this._("Confirmation"),
			text: this._("Are you sure you want to delete this item permanently?"),
			ok: this._("OK"),
			cancel: this._("Cancel")
		};
		webix.confirm(info).then(() => {
			filesCollection.remove(obj);
		});
		return false;
	}

	init() {
		this.$$("table").sync(filesCollection);
	}
}
