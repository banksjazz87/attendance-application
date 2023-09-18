const DateMethods = {
   
    getAllMonthNames(): string[] {
        let months = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        return months;
    },

    getMonthDay(str: string): string {

        let months = this.getAllMonthNames();
        
        //Create an array of the string
		let arrayOfStr = str.split(" ");

		//Get the last two of the year
		let year = arrayOfStr.slice(2).toString();
		let arrYear = year.split("");
		let lastTwoOfYear = arrYear.slice(2).join("");

		//Just get the month and day
		let noYear = arrayOfStr.slice(0, 2);

		//Replace the text of the month to a number
		noYear.splice(0, 1, months.indexOf(noYear[0]).toString());

		//Add the last two of the year to the end.
		noYear.push(lastTwoOfYear);

		let addDash = noYear.join("/");
		return addDash;
    },

	getMonthName(num: number): string | undefined {
		const months = this.getAllMonthNames();
		const selectedArr = months.slice(num, num + 1);

		if (selectedArr.length > 0) {
			return selectedArr.toString();
		}

	}

}   

export default DateMethods;
