import URLs from "../urls";

const activityTypes = new webix.DataCollection({
	scheme: {
		$init(obj) {
			obj.value = obj.Value;
		}
	},
	url: URLs.typesUrl
});

export default activityTypes;
