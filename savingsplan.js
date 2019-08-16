function periodize(target, current, years, interest, ppy){
	var	amount = (target - current*(Math.pow(1+interest/ppy,years*ppy)))/((Math.pow((1+interest/ppy),years*ppy)-1) * (ppy/interest))
	return amount;
}

function calculate(){
	var interest = Number(document.getElementById("interest").value);
	var years = Number(document.getElementById("years").value);
	
	//update info on slider
	document.getElementById("years_label").innerHTML = years + " years";
	document.getElementById("interest_label").innerHTML = interest + "%";
	
	//initiate the google data table
	google.charts.load('current', {'packages':['table']});
	google.charts.setOnLoadCallback(calculate_table);
	
}

function calculate_table(){
	var target = Number(document.getElementById("target").value);
	var current = Number(document.getElementById("current").value);
	var interest = Number(document.getElementById("interest").value);
	var years = Number(document.getElementById("years").value);
	interest = interest/100;	

	var data = new google.visualization.DataTable()
	data.addColumn('number', 'Year')
	data.addColumn('number', 'Annually')
	data.addColumn('number', 'Monthly')
	data.addColumn('number', 'Weekly')
	data.addColumn('number', 'Daily')
	
	for(let year = 1; year<=document.getElementById("years").max; year++){

		var daily = Math.ceil(periodize(target,current,year, interest, 365));
		var weekly = Math.round(periodize(target,current,year, interest, 52));
		var monthly = Math.round(periodize(target,current,year, interest, 12));
		var yearly = Math.round(periodize(target,current,year, interest, 1));
		
		if(daily<0 || weekly < 0 || monthly < 0 || yearly < 0){
			var row = data.getNumberOfRows()-1;
			
			document.getElementById("annual").innerHTML = numeral(data.getValue(row,1)).format("$0,0[.]00")
			document.getElementById("monthly").innerHTML = numeral(data.getValue(row,2)).format("$0,0[.]00")
			document.getElementById("weekly").innerHTML = numeral(data.getValue(row,3)).format("$0,0[.]00")
			document.getElementById("daily").innerHTML = numeral(data.getValue(row,4)).format("$0,0[.]00")
			break;
		}
		
		else{
			data.addRow([year,yearly,monthly,weekly,daily])
		
			//add the row to the output
			if(years == year){
				document.getElementById("annual").innerHTML = numeral(yearly).format("$0,0[.]00")
				document.getElementById("monthly").innerHTML = numeral(monthly).format("$0,0[.]00")
				document.getElementById("weekly").innerHTML = numeral(weekly).format("$0,0[.]00")
				document.getElementById("daily").innerHTML = numeral(daily).format("$0,0[.]00")
			}
		}
		
	}
	
	var options = {
		width: '100%',
		style: 'font-family:Verdana',
		sort: 'disable',
		backgroundColor: { fill:'transparent' },
		
	}
	
	var formatter = new google.visualization.NumberFormat({prefix: '$', fractionDigits:0});
	formatter.format(data, 1)
	formatter.format(data, 2)
	formatter.format(data, 3)
	formatter.format(data, 4)
	
	

	var table = new google.visualization.Table(document.getElementById('result'));
    table.draw(data, options);
}

function toggle_results(){
	$("#result_container").toggleClass("cn-hide");
}