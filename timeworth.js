function calculate(){
	var wage = Number(document.getElementById("wage").value);
	var amount = Number(document.getElementById("amount").value);
	
	var hpp = 0 //hours per period
	switch(document.getElementById("schedule").value){
		case("salary"):
			hpp = 2080;
			break;
		case("hourly"):
			hpp = 1;
			break;	
		case("weekly"):
			hpp = 40;
			break;	
		case("biweekly"):
			hpp = 80;
			break;
		case("monthly"):
			hpp = 173.3333333333;
			break;			
		default: //default case
			console.log("error");
			return;
	}
	var hourly_wage = wage/hpp;	
	var value_hours = amount/hourly_wage;

	//document.getElementById("hourly_wage").innerHTML = numeral(hourly_wage).format('$0,0[.]00')
	document.getElementById("purchase_amount").innerHTML = numeral(amount).format('$0,0[.]00')
	
	var days = Math.floor(value_hours/8);
	var hours = Math.floor(value_hours%8);
	var minutes = Math.floor(value_hours%1*60)
	
	document.getElementById("days").innerHTML = days
	document.getElementById("hours").innerHTML = hours
	document.getElementById("minutes").innerHTML = minutes
	
	if(days == 1)
		document.getElementById("day_label").innerHTML = "day"
	else
		document.getElementById("day_label").innerHTML = "days"		
	if(hours == 1)
		document.getElementById("hour_label").innerHTML = "hour"
	else
		document.getElementById("hour_label").innerHTML = "hours"
	if(minutes == 1)
		document.getElementById("minute_label").innerHTML = "minute"		
	else
		document.getElementById("minute_label").innerHTML = "minutes"		
	
}

function amount_update(caller){
	if(caller.id == "amount_slider"){
		document.getElementById("amount").value = document.getElementById("amount_slider").value
	}
	else{
		document.getElementById("amount_slider").value = document.getElementById("amount").value
	}
	calculate();

}