//global variables
var workingArray = []
var retiredArray = []

$(document).ready(function(){
	populate_defaults();
});

function populate_defaults(){
	document.getElementById('current_savings').value = 100000;
	document.getElementById('age').value = 24;
	document.getElementById('salary').value = 80000;
	document.getElementById('savings_rate').value = 45;
	document.getElementById('raise').value = 1;
	document.getElementById('expense').value = 50000;
	document.getElementById('expense_change').value = 0.5;
	document.getElementById('pre_interest').value = 7;
	document.getElementById('post_interest').value = 4;
	document.getElementById('retirement_age').value = 40;
	document.getElementById('retirement_length').value = 50;
}

class Year {
	constructor(age, assets_BOY, assets_EOY, cash_flow, interest_gain){
		this.age = age
		this.boy = assets_BOY
		this.eoy = assets_EOY
		this.cash_flow = cash_flow
		this.interest = interest_gain
	}
	
	//returns array as [age, assets BoY, cash flow, interest, assets EoY]
	get asArray(){
		var array = []
		array.push(this.age)
		array.push(this.boy)
		array.push(this.cash_flow)
		array.push(this.interest_gain)
		array.push(this.eoy)
		return array
	}
}

function calculate(){
	
	//compute the working/retirement numbers
	var arrays = compute()

	//get the data into arrays for tabling and charting	
	workingArray = arrays[0]
	retiredArray = arrays[1]
	
	google.charts.load('current', {packages: ['corechart', 'line']});
	google.charts.setOnLoadCallback(function call(workingArray, retiredArray){
		drawChart(workingArray, retiredArray)
		});
		
}


function drawChart(){
	
	//initiate the google data table
	var data = new google.visualization.DataTable()
	data.addColumn('number', 'Year')
	data.addColumn('number', 'Assets (working)')
	data.addColumn('number', 'Assets (retired)')
	
	//go through workingArray and get it into array form
	for(var i = 0; i< workingArray.length; i++){
		var age = workingArray[i].age
		var asset = workingArray[i].boy
		data.addRows([[age, asset, null]])
	}

	//add the first year of retirement
	asset_at_retire = retiredArray[0].boy
	data.addRows([[age+1, asset_at_retire, null]]) //this line allows us to connect the lines
	
	//go through retiredArray and get it into array form
	for(var i = 0; i< retiredArray.length; i++){
		var age = retiredArray[i].age
		var asset = retiredArray[i].boy
		data.addRows([[age, null, asset]])
	}
	
	//Add last data point EOY
	asset_at_retire = retiredArray[retiredArray.length-1].eoy
	data.addRows([[age+1, null, asset_at_retire]]) 
	
	//options for the chart
	var options = {
		vAxis: {
          title: 'Savings ($)',
        },
        hAxis: {
          title: 'Year'
        },
        width: "auto",
        height: 500,
        
        legend: {position: 'none'}
      };

    //draw the chart
	var chart = new google.visualization.LineChart(document.getElementById('chart'))
	chart.draw(data, options);
	}

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
	
		while(age < (retirement_age + retirement_length) && assets>0){
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
The below monitors the window and redraws the chart to ensure it is the right size
*/

var doit;
function resizedw(){
    drawChart()
}
window.onresize = function() {
    clearTimeout(doit);
    doit = setTimeout(function() {
        resizedw();
    }, 300);
};



