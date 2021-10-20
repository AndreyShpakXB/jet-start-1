import BaseView from "../../BaseView";

export default class EditTableView extends BaseView {
	constructor(app, data) {
		super(app);
		this._dataCollection = data;
	}

	config() {
		return {
			localId: "table",
			view: "datatable",
			editable: true,
			columns: [
				{id: "Value", header: this._("Value"), maxWidth: 300, editor: "text"},
				{id: "Icon", header: this._("Icon"), fillspace: true, editor: "text"},
				{id: "delete", header: "", template: "{common.trashIcon()}", width: 40}
			],
			onClick: {
				"wxi-trash": this.onDelete
			},
			select: "row",
			rules: {
				Icon: this.webix.rules.isNotEmpty,
				Value: this.webix.rules.isNotEmpty
			},
			on: {
				onBeforeEditStop(state, editor, ignore) {
					const check = (editor.getValue() !== "");
					if (!ignore && !check) {
						webix.message({type: "error", text: `${this._("Column")} '${this._(editor.column)}' ${this._("must not be empty")}`});
						return false;
					}
					return true;
				}
			},
			ready() {
				this.validate();
			}
		};
	}

	init() {
		const table = this.$$("table");
		table.sync(this._dataCollection);
	}

	onDelete(e, obj) {
		const info = {
			title: this.$scope._("Confirmation"),
			text: this.$scope._("Are you sure you want to delete this item permanently?"),
			ok: this.$scope._("OK"),
			cancel: this.$scope._("Cancel")
		};
		webix.confirm(info).then(() => {
			this.$scope._dataCollection.remove(obj);
		});
		return false;
	}

	editCancel() {
		this.$$("table").editCancel();
	}
}
