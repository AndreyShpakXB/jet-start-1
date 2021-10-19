import {JetView} from "webix-jet";

export default class EditTableView extends JetView {
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
				{id: "Value", header: "Value", maxWidth: 300, editor: "text"},
				{id: "Icon", header: "Icon", fillspace: true, editor: "text"},
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
						webix.message({type: "error", text: `${editor.column} must not be empty`});
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
		webix.confirm("Are you sure you want to delete this item permanently?").then(() => {
			this.$scope._dataCollection.remove(obj);
		});
		return false;
	}
}
