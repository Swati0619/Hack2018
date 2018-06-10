var twitterHandles = [];
var chartData = [];
var sentiChartData= [];
var buySellChartData= [];
var pieChartData = [];
$(document).ready(function () {
 loadAllCharts()
});
console.log(chartData);
function loadTwitterhandles() {
    $.ajax({
        url: baseURL + "/searchTweet/getHandles"
    }).then(function (data) {
        twitterHandles = data;
        $.each(twitterHandles, function (single, value) {
            console.log(single);
            console.log(value);
            $("#tweetSelect").append($("<option></option>").attr("value", value).text(value));
        })
        console.log(twitterHandles);
    });
}

function getStatisticsABC() {
    $.ajax({
        url: baseURL + "/charts/bpiChart",
        type: "post",
        "content-type": "application/json",
        data: {
            "timeFilter": '60 minutes'
        }
    }).then(function (data) {
        console.log(data);
        chartData = data;
       // pieChartData = data.pieChartData;
        loadCharts();
       // loadPieChart()
    });
}

function getSentimentChart() {
    $.ajax({
        url: baseURL + "/charts/sentiChart",
        type: "post",
        "content-type": "application/json",
        data: {
            "timeFilter": '60 minutes'
        }
    }).then(function (data) {
        console.log(data);
        sentiChartData = data;
       // pieChartData = data.pieChartData;
        loadSentimentChart()
       // loadPieChart()
    });
}

function getBuySellChart() {
    $.ajax({
        url: baseURL + "/charts/buySellData",
        type: "post",
        "content-type": "application/json",
        data: {
            "timeFilter": '60 minutes'
        }
    }).then(function (data) {
        console.log(data);
        buySellChartData = data;
       // pieChartData = data.pieChartData;
        loadBuySellChart();
       // loadPieChart()
    });
}

function loadCharts() {
    google.charts.load('current', { 'packages': ['corechart'] });
    google.charts.setOnLoadCallback(drawVisualization);

}

function loadSentimentChart() {
    google.charts.load('current', { 'packages': ['corechart'] });
    google.charts.setOnLoadCallback(drawSentimentChart);

}

function loadBuySellChart() {
    google.charts.load('current', { 'packages': ['corechart'] });
    google.charts.setOnLoadCallback(drawBuySellChart);

}

function drawVisualization() {
    var barChartArr = new Array();
    barChartArr.push(['Time', 'BitcoinPrice']);
    for (var x = 0; x < chartData.length; x++) {

         var tempArr = new Array();
         tempArr.push(chartData[x].bpicapture);
         tempArr.push(parseFloat(chartData[x].usd));
        barChartArr.push(tempArr);
    }
    console.log(barChartArr);
    var data = google.visualization.arrayToDataTable(barChartArr);
    var options = {
        title: '',
        hAxis:{
            title:'Time',textStyle: {
                color: 'black',
                fontSize: 10,
                fontName: 'Arial',
                bold: true
            }, titleTextStyle: {
                color: '#01579b',
                fontSize: 10,
                fontName: 'Arial',
                bold: true
            },direction:-1, slantedText:true, slantedTextAngle:90
        },
        vAxis:{
            title:'BitCoin Price in USD ',textStyle: {
                color: 'black',
                fontSize: 12,
                fontName: 'Arial',
                bold: true
            }, titleTextStyle: {
                color: '#01579b',
                fontSize: 12,
                fontName: 'Arial',
                bold: true
            }
        }
       // curveType: 'function',
       // legend: { position: 'bottom' }
      };
    var chart = new google.visualization.LineChart(document.getElementById('chart_div'));
    chart.draw(data, options);
}

function drawSentimentChart() {
    var barChartArr = new Array();
    barChartArr.push(['Time', 'Avg Sentiment value ']);
    for (var x = 0; x < sentiChartData.length; x++) {
         var tempArr = new Array();
         tempArr.push(sentiChartData[x].timec);
         tempArr.push(parseFloat(sentiChartData[x].round));
        barChartArr.push(tempArr);
    }
    console.log(barChartArr);
    var data = google.visualization.arrayToDataTable(barChartArr);
    var options = {
        title: '',
       // curveType: 'function'
        hAxis:{
            title:'Time',textStyle: {
                color: 'black',
                fontSize: 12,
                fontName: 'Arial',
                bold: true
            }, titleTextStyle: {
                color: '#01579b',
                fontSize: 12,
                fontName: 'Arial',
                bold: true
            }, textPosition:'none'
        },
        vAxis:{
            title:'Sentiment Score ',textStyle: {
                color: 'black',
                fontSize: 12,
                fontName: 'Arial',
                bold: true
            }, titleTextStyle: {
                color: '#01579b',
                fontSize: 12,
                fontName: 'Arial',
                bold: true
            } 
        }
      };
    var chart = new google.visualization.LineChart(document.getElementById('chart_div1'));
    chart.draw(data, options);
}

function drawBuySellChart() {
    var barChartArr = new Array();
    barChartArr.push(['Action', 'Time ', {'type': 'string', 'role': 'style'}]);
    for (var x = 0; x < buySellChartData.length; x++) {
         var tempArr = new Array();
         tempArr.push(buySellChartData[x].timec);
         console.log(buySellChartData[x].action);
         if(buySellChartData[x].action == "BUY")
         {
             tempArr.push(1);
             tempArr.push('point { pointSize: 18;  fill-color: #28a745; }')
         } else if(buySellChartData[x].action == "SELL" )
         {
            tempArr.push(1);
            tempArr.push('point {  pointSize: 18;  fill-color: red; }')
         }else{
            tempArr.push(1);
            tempArr.push('point {  fill-color: #99ccff; }')
         }
         
        // tempArr.push(parseFloat(sentiChartData[x].round));
         barChartArr.push(tempArr);
    }
    console.log(barChartArr);
    var data = google.visualization.arrayToDataTable(barChartArr);
    var options = {
        title: '',
       // curveType: 'function',
      //  legend: { position: 'bottom' },
        hAxis:{
            title:'Time',textStyle: {
                color: 'black',
                fontSize: 9,
                fontName: 'Arial',
                bold: true
            }, titleTextStyle: {
                color: '#01579b',
                fontSize: 9,
                fontName: 'Arial',
                bold: true
            },direction:-1, slantedText:true, slantedTextAngle:90
        },
        vAxis:{
            title:'ACT',textStyle: {
                color: 'black',
                fontSize: 12,
                fontName: 'Arial',
                bold: true
            }, titleTextStyle: {
                color: '#01579b',
                fontSize: 12,
                fontName: 'Arial',
                bold: true
            } ,
            gridlineColor: '#fff',
            textPosition: 'none'
        }
      };
    var chart = new google.visualization.ScatterChart(document.getElementById('chart_div2'));
    chart.draw(data, options);
}

function loadAllCharts(){
    console.log("Inside Load All Charts");
    getStatisticsABC();
    getSentimentChart();
    getBuySellChart();
}
window.setInterval(loadAllCharts,60000);