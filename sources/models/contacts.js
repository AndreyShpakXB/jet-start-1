import URLs from "../urls";

const contactsCollection = new webix.DataCollection({
	scheme: {
		$init(val) {
			if (!val.value) {
				val.value = `${val.FirstName} ${val.LastName}`;
			}
		}
	},
	url: URLs.contactsUrl,
	save: `rest->${URLs.contactsUrl}`
});

export default contactsCollection;
