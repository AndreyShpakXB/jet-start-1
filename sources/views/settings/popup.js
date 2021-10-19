import {JetView} from "webix-jet";

export default class ItemPopup extends JetView {
	config() {
		return {
			localId: "popup",
			modal: true,
			view: "window",
			width: 600,
			position: "center",
			head: {template: "Add", localId: "header"},
			body: {
				view: "form",
				localId: "popup_form",
				align: "center",
				padding: 10,
				margin: 10,
				elements: [
					{view: "text", label: "Value", name: "Value"},
					{view: "text", label: "Icon", name: "Icon"},
					{cols: [
						{view: "button", label: "Add", localId: "button_add", click: this.buttonAddClick},
						{view: "button", label: "Cancel", click: this.onCancel}
					]}
				],
				rules: {
					Value: this.webix.rules.isNotEmpty,
					Icon: this.webix.rules.isNotEmpty
				}
			}
		};
	}

	onCancel() {
		const form = this.$scope.$$("popup_form");
		form.clear();
		form.clearValidation();
		this.$scope.getRoot().hide();
	}

	buttonAddClick() {
		const form = this.$scope.$$("popup_form");
		if (!form.validate()) {
			return;
		}
		const item = form.getValues();
		if (item && this.$scope._dataCollection) {
			this.$scope._dataCollection.add(item);
		}
		this.$scope.getRoot().hide();
	}

	showPopup(data) {
		this._dataCollection = data;
		this.$$("popup").show();
	}
}
