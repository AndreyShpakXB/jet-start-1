import URLs from "../urls";

const statusesCollection = new webix.DataCollection({
	url: URLs.statusesUrl
});

export default statusesCollection;
