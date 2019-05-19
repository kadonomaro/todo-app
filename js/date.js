function getDate() {

	var months = [
		'January', 'February', 'March',
		'April', 'May', 'June',
		'July', 'August', 'September',
		'October', 'November', 'December'
	];
	var date = new Date();
	var dateNow =
		date.getHours() + ':' + date.getMinutes() + ' ' +
		date.getDate() + ' ' + months[date.getMonth()] + ' ' + date.getFullYear();
	
	return dateNow;
}

export default getDate;