function calculate(){
	var amount = Number(document.getElementById("amount").value);
	var interest = Number(document.getElementById("interestIn").value);
	var years = Number(document.getElementById("yearIn").value);
	
	//update info on slider
	document.getElementById("years").innerHTML = years + " years";
	document.getElementById("interest").innerHTML = interest + "%";
	
	var ppy = 0 //periods per year
	switch(document.getElementById("schedule").value){
		case("daily"):
			ppy = 365;
			break;
		case("weekly"):
			ppy = 52;
			break;	
		case("monthly"):
			ppy = 12;
			break;
		case("annually"):
			ppy = 1;
			break;			
		default: //default case and also "one time"
			break;
	}
	var result;
	interest/=100;
	
	//one time deposit
	if(ppy == 0){
		result = amount*(Math.pow(1+interest,years))
	}
	
	//all others
	else{
		result = amount * (Math.pow((1+interest/ppy),years*ppy)-1) * (ppy/interest);
	}
	
	result = Math.round(result*100)/100;
	document.getElementById("result").innerHTML = numeral(result).format('$0,0[.]00')
	
}