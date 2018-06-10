var twitterHandles = [];
var chartData = [];
var sentiChartData= [];
var buySellChartData= [];
var pieChartData = [];
$(document).ready(function () {
 
    getStatisticsABC();
    getSentimentChart();
    getBuySellChart();
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
                fontSize: 12,
                fontName: 'Arial',
                bold: true
            }, titleTextStyle: {
                color: '#01579b',
                fontSize: 12,
                fontName: 'Arial',
                bold: true
            }
        },
        vAxis:{
            title:'Rate in USD ',textStyle: {
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
            }
        },
        vAxis:{
            title:'Average Sentiment Value ',textStyle: {
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
             tempArr.push('point { pointSize: 18;  fill-color: green; }')
         } else if(buySellChartData[x].action == "SELL" )
         {
            tempArr.push(1);
            tempArr.push('point {  pointSize: 18;  fill-color: red; }')
         }else{
            tempArr.push(1);
            tempArr.push('point {  fill-color: yellow; }')
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
                fontSize: 12,
                fontName: 'Arial',
                bold: true
            }, titleTextStyle: {
                color: '#01579b',
                fontSize: 12,
                fontName: 'Arial',
                bold: true
            }
        },
        vAxis:{
            title:'Action ',textStyle: {
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
    var chart = new google.visualization.ScatterChart(document.getElementById('chart_div2'));
    chart.draw(data, options);
}

function callToSearchData() {
    var selectedHandle = $("#tweetSelect").val();
    callSearchAPI(selectedHandle);
    getStatistics(selectedHandle);
    //   getStatistics(selectedHandle);
    //console.log(selectedHandle)
}
function callSearchAPI(selected) {
    $.ajax({
        url: baseURL + '/searchTweet',
        type: 'post',
        dataType: 'json',
        data: {
            "searchTerm": selected
        },
        success: function (data) {
            console.log(data);
            //   getStatistics(selectedHandle);
        }
    });
}
function loadPieChart() {
    google.charts.load("current", { packages: ["corechart"] });
    google.charts.setOnLoadCallback(drawPieChart);
}
function drawPieChart() {
    var dataArray = new Array();
    dataArray.push(["Sentiments", "No of Tweets"])
    dataArray.push(['Positive', pieChartData.positive])
    dataArray.push(['Negative', pieChartData.negative])
    dataArray.push(['Query', pieChartData.question])
    dataArray.push(['Other', pieChartData.other])

    // var data = google.visualization.arrayToDataTable([
    //     ['Sentiments', 'No of Tweets'],
    //     ['Positive', 11],
    //     ['Negative', 2],
    //     ['Neutral', 2]
    // ]);
    var data = google.visualization.arrayToDataTable(dataArray);
    var options = {
        is3D: true,
        slices: {
            0: { color: '#28a745' },
            1: { color: '#dc3545' },
            2: { color: '#007bff' },
            3: { color: '#ffc107' }
        }
    };

    var chart = new google.visualization.PieChart(document.getElementById('pie_div'));
    chart.draw(data, options);
}