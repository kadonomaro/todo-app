function getDate(datetime = false) {
	var date = new Date();
	var months = [
		'January', 'February', 'March',
		'April', 'May', 'June',
		'July', 'August', 'September',
		'October', 'November', 'December'
	];
	

	function convertMinutes(date) {
		var minutes = (date.getMinutes() < 10 ? '0' : '') + date.getMinutes();
		return minutes;
	}
	
	
	var dateNow;
	if (!datetime) {
		dateNow =
			date.getHours() + ':' + convertMinutes(date) + ' ' +
			date.getDate() + ' ' + months[date.getMonth()] + ' ' + date.getFullYear();
	
	return dateNow;
	} else {
		dateNow =
			date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() +
			' ' + date.getHours() + ':' + convertMinutes(date); 
			

		return dateNow;
	}

}

export default getDate;
