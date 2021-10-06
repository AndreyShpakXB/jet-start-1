import {JetView} from "webix-jet";

import contactsCollection from "../../models/contacts";

export default class ContactsListView extends JetView {
	config() {
		return {
			localId: "list",
			view: "list",
			maxWidth: 300,
			template:
			`<div style="display:flex;direction:column;">
				<div style="user-icon"></div>
				<div>
					<div>#name# #surname#</div>
					<div>#email#</div>
				</div>
			</div>`,
			type: {
				height: 60
			},
			select: true,
			on: {
				onAfterSelect(id) {
					this.$scope.show(`/top/contacts?id=${id}`);
				}
			}
		};
	}

	init() {
		contactsCollection.waitData.then(() => {
			const list = this.$$("list");
			list.parse(contactsCollection);
			list.select(contactsCollection.getFirstId());
		});
	}
}
