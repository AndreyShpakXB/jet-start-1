import {JetView} from "webix-jet";

import {DATE_FORMAT_F} from "../../helpers";
import filesCollection from "../../models/files";

export default class FilesTableView extends JetView {
	config() {
		const _ = this.app.getService("locale")._;
		return {
			localId: "table",
			view: "datatable",
			columns: [
				{id: "name", header: _("Name"), minWidth: 150, sort: "text", fillspace: true},
				{id: "lastModifiedDate", header: _("Change date"), minWidth: 150, width: 250, sort: "date", format: webix.Date.dateToStr(DATE_FORMAT_F)},
				{id: "size", header: _("Size"), minWidth: 150, sort: "int", template: "#sizetext#"},
				{id: "delete", header: "", template: "{common.trashIcon()}", width: 40}
			],
			onClick: {
				"wxi-trash": () => this.onDelete()
			},
			select: "row"
		};
	}

	onDelete(e, obj) {
		const _ = this.app.getService("locale")._;
		const info = {
			title: _("Confirmation"),
			text: _("Are you sure you want to delete this item permanently?"),
			ok: _("OK"),
			cancel: _("Cancel")
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
