//global variables
var workingArray = []
var retiredArray = []

$(document).ready(function(){
	populate_defaults();
});

class Year {
	constructor(age, assets_BOY, assets_EOY, cash_flow, interest_gain){
		this.age = age
		this.boy = assets_BOY
		this.eoy = assets_EOY
		this.cash_flow = cash_flow
		this.interest = interest_gain
	}
	
	//returns array as [age, assets BoY, cash flow, interest, assets EoY]
	asArray(){
		var array = []
		array.push(this.age)
		array.push(Math.round(this.boy*100)/100)
		array.push(Math.round(this.cash_flow*100)/100)
		array.push(Math.round(this.interest*100)/100)
		array.push(Math.round(this.eoy*100)/100)
		return array
	}
	
	//creates a tooltip for the Google Chart using HTML
	createToolTip(){
		var formatter = new Intl.NumberFormat('en-US', {
  			style: 'currency',
  			currency: 'USD',
  			minimumFractionDigits: 0,
   			maximumFractionDigits: 0
		});
		
		var string = '<div align = "left" style=" font-family:Arial; width: 20ch">'
		string+="<b>"+this.age + "</b><br>"
		
		//add opening assets
		string += "BoY: <b>" + formatter.format(Math.round(this.boy)) + "</b><br>"
		
		//add cash flow
		string += "Cash Flow: <b>" + formatter.format(Math.round(this.cash_flow)) + "</b><br>"
		
		//add ending assets
		string += "EoY: <b>" + formatter.format(Math.round(this.eoy)) + "</b><br>"
		string+= "</div>"

		return string
		
	}
}

function calculate(){
	
	//compute the working/retirement numbers
	var arrays = compute()

	//get the data into arrays for tabling and charting	
	workingArray = arrays[0]
	retiredArray = arrays[1]
	
	//draw chart
	google.charts.load('current', {packages: ['corechart', 'line']});
	google.charts.setOnLoadCallback(drawChart);

	//draw table
	google.charts.load('current', {'packages':['table']});
	google.charts.setOnLoadCallback(drawTable);
	
	$('#results_bar').show()
			
}

function drawTable(){
	//initiate the google data table
	var data = new google.visualization.DataTable()
	data.addColumn('number', 'Year')
	data.addColumn('number', 'Opening')
	data.addColumn('number', 'Cash Flow')
	data.addColumn('number', 'Interest gain')
	data.addColumn('number', 'End of Year')
	
	//add working years to data table
	for(var i = 0; i<workingArray.length; i++){
		data.addRows([workingArray[i].asArray()])
	}

	//add retired years to data table
	for(var i = 0; i<retiredArray.length; i++){
		data.addRows([retiredArray[i].asArray()])
	}
	
	var options = {
		width: '100%', 
		height: 500,
		style: 'font-family:Verdana',
		sort: 'disable',
		backgroundColor: { fill:'transparent' }
	}
	
	var formatter = new google.visualization.NumberFormat({prefix: '$', negativeColor: 'red', negativeParens: true});
	formatter.format(data, 1)
	formatter.format(data, 2)
	formatter.format(data, 3)
	formatter.format(data, 4)

	var table = new google.visualization.Table(document.getElementById('table'));
    table.draw(data, options);
	
}

function drawChart(){
	
	//initiate the google data table
	var data = new google.visualization.DataTable()
	data.addColumn('number', 'Year')
	data.addColumn('number', 'Working')
	data.addColumn({type: 'string', role: 'tooltip', 'p': {'html': true}});
	data.addColumn('number', 'Retirement')
	data.addColumn({type: 'string', role: 'tooltip', 'p': {'html': true}});
	
	//go through workingArray and get it into array form
	for(var i = 0; i< workingArray.length; i++){
		var age = workingArray[i].age
		var asset = workingArray[i].boy
		var tooltip = workingArray[i].createToolTip()
		data.addRows([[age, asset, tooltip, null, null]])
	}

	//add the first year of retirement
	//this allows us to connect the lines
	asset_at_retire = retiredArray[0].boy
	data.addRows([[age+1, asset_at_retire, retiredArray[0].createToolTip(),null, null]]) 
	
	//go through retiredArray and get it into array form
	for(var i = 0; i< retiredArray.length; i++){
		var age = retiredArray[i].age
		var asset = retiredArray[i].boy
		var tooltip = retiredArray[i].createToolTip()
		data.addRows([[age, null, null,asset, tooltip]])
	}
	
	//options for the chart
	var options = {
		tooltip: {isHtml: true},
		vAxis: {
          title: 'Savings ($)',
          format: "short"
        },
        hAxis: {
          title: 'Year',
          maxValue: retiredArray[retiredArray.length-1].age + 5
        },
        width: "auto",
        height: 500,
        lineWidth: 4,
        pointSize: 2,
        backgroundColor: { fill:'transparent' },
        legend: {position: 'top'},
        'chartArea': {'width': '80%', 'height': '80%', 'right':5}
      };

    //draw the chart
	var chart = new google.visualization.LineChart(document.getElementById('chart'))
	chart.draw(data, options);
	
	$('#results').show()
	}

/*
 * Computes the retirement calculation and saves the values into global arrays
*/
function compute(){
	
		var assets = Number(document.getElementById("current_savings").value);
		var age = Number(document.getElementById("age").value);
		var salary = Number(document.getElementById("salary").value);
		var savings_rate = Number(document.getElementById("savings_rate").value) / 100.0;
		var raise = Number(document.getElementById("raise").value)/ 100.0;
		var expense = Number(document.getElementById('expense').value);
		var expense_change = Number(document.getElementById('expense_change').value)/100.0;
		var pre_interest = Number(document.getElementById("pre_interest").value) / 100.0;
		var post_interest = Number(document.getElementById("post_interest").value) / 100.0;
		var retirement_age = Number(document.getElementById('retirement_age').value);
		var retirement_length = Number(document.getElementById('retirement_length').value);
	
	
		/*
		PRE-RETIREMENT
		*/
	
		//initialize an array to track all working years
		workingArray = []
	
		while(age < retirement_age){
			var start = assets
			var monthly_gain = salary/12 * savings_rate
			var monthly_interest = pre_interest/12
			var interest_gain = 0
			
			//calculate gains and interest on a monthly basis
			for(var i = 0; i < 12; i++){
				interest_gain += assets * (1 + monthly_interest)
				assets = (assets + monthly_gain)*(1+monthly_interest)
			}
					
			var cash_flow = assets - start
		
			//round to 2 decimals
			cash_flow = Math.round(cash_flow*100)/100
			interest_gain = Math.round(interest_gain*100)/100
			assets = Math.round(assets*100)/100
			
			workingArray.push(new Year(age, start, assets, cash_flow, interest_gain))	
		
			//calculate YoY changes
			age++;
			salary *= (1+raise)
		}
	
		/*
		POST-RETIREMENT
		*/
		//initialize an array to track all the retirement years
		retiredArray = []
	
		//loop retirement until negative or you reach 150 years
		while(age < (retirement_age+retirement_length) && assets>0){
			var start = assets
		
			//calculate asset gain through interest as average of year start and year end
			var interest_gain = (post_interest) * (assets - expense/2);
		
			//calculate cash flow
			var cash_flow = interest_gain - expense
			assets += cash_flow
		
			retiredArray.push(new Year(age, start, assets, cash_flow, interest_gain))	
		
			//calculate YoY changes
			age++;
			expense *= (1+expense_change)
		}
		
		return [workingArray, retiredArray]
	}
	
/*
 * Populates the values using cookies or a saved default value set
*/
function populate_defaults(){
	document.getElementById('current_savings').value = 20000;
	document.getElementById('age').value = 24;
	document.getElementById('salary').value = 60000;
	document.getElementById('savings_rate').value = 20;
	document.getElementById('raise').value = 1;
	document.getElementById('expense').value = 50000;
	document.getElementById('expense_change').value = 0;
	document.getElementById('pre_interest').value = 7;
	document.getElementById('post_interest').value = 4;
	document.getElementById('retirement_age').value = 50;
	document.getElementById('retirement_length').value = 40;
	
	//Load the cookies if they can be found
	if(value = getCookie('current_savings')) document.getElementById('current_savings').value = value
	if(value = getCookie('age')) document.getElementById('age').value = value
	if(value = getCookie('salary')) document.getElementById('salary').value = value
	if(value = getCookie('savings_rate')) document.getElementById('savings_rate').value = value
	if(value = getCookie('raise')) document.getElementById('raise').value = value
	if(value = getCookie('expense')) document.getElementById('expense').value = value
	if(value = getCookie('expense_change')) document.getElementById('expense_change').value = value
	if(value = getCookie('pre_interest')) document.getElementById('pre_interest').value = value
	if(value = getCookie('post_interest')) document.getElementById('post_interest').value = value
	if(value = getCookie('retirement_start')) document.getElementById('retirement_age').value = value
	if(value = getCookie('retirement_length')) document.getElementById('retirement_length').value = value
	
}
	
/*
 * Get a previously saved cookie
*/
function getCookie(name){
	var re = new RegExp(name + "=([^;]+)");
    var value = re.exec(document.cookie);
    
    return (value != null) ? unescape(value[1]) : null;
    
}


/*
 * Set a Cookie to store values
*/
function setCookie(name, value){
	var today = new Date();
	var expiry = new Date(today.getTime() + 30 *24 * 3600 * 1000) //plus 30 days
	document.cookie = name + "=" + value + ", path=/, expires=" + expiry.toUTCString();
	return true
}

/*
 * Saves the input values as default using Cookies. Valid for 30 days
*/
function saveDefault(){
	setCookie("current_savings", document.getElementById('current_savings').value)
	setCookie("age", document.getElementById('age').value)
	setCookie("salary", document.getElementById('salary').value)
	setCookie("savings_rate", document.getElementById('savings_rate').value)
	setCookie("raise", document.getElementById('raise').value)
	setCookie("expense", document.getElementById('expense').value)
	setCookie("expense_change", document.getElementById('expense_change').value)
	setCookie("pre_interest", document.getElementById('pre_interest').value)
	setCookie("post_interest", document.getElementById('post_interest').value)
	setCookie("retirement_start", document.getElementById('retirement_age').value)
	setCookie("retirement_length", document.getElementById('retirement_length').value)

}

function openResult(id){
	$(".results").hide();
	$("#"+id).show();
}

	
/*
The below monitors the window and redraws the chart to ensure it is the right size
*/
var doit;
function resizedw(){
    if(workingArray.length >0){
    	drawChart()
    }
}
window.onresize = function() {
    clearTimeout(doit);
    doit = setTimeout(function() {
        resizedw();
    }, 300);
};



