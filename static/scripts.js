document.addEventListener('DOMContentLoaded', function () {
    var socket = io();

    socket.on('connect', function() {
        console.log('Connected to server');
    });

    socket.on('btc_quote', function(quote) {
        var times = quote.time;
        var btc = parseFloat(quote.price);
        var timesdisplay = formatDate(times);

        document.getElementById('time').innerText = timesdisplay;
        document.getElementById('price').innerText = btc;
        document.getElementById('volume').innerText = quote.volume;

        // Debugging statement to check the type of data
        //console.log('Before push, data:', data);

        // Ensure data is an array before pushing new elements
        if (!Array.isArray(data)) {
            console.error('data is not an array:', data);
            data = [];
        }

        // Push new data point to the data array
        data.push({ x: times, y: btc });

        // Debugging statement to check the type of data after push
        //console.log('After push, data:', data);

        // Update the chart with the new data
        real_chart.updateSeries([{ data: data }]);

        // Call the function to update y-axis dynamically
        updateYAxis(real_chart, btc);
    });
});

//////////////////////////////////////////////////////////////////
//////////////////////// Real Time Line - Grafico 1 //////////////
//////////////////////////////////////////////////////////////////

var data = [];
var XAXISRANGE = 100000;

var real_time_options = {
    series: [{
        data: data
    }],
    chart: {
        id: 'realtime',
        height: 500,
        type: 'line',
        animations: {
            enabled: true,
            easing: 'linear',
            //dynamicAnimation: {
            //  speed: 1000
            // }
        },
        toolbar: {
            show: false
        },
        zoom: {
            enabled: false
        }
    },
    dataLabels: {
        enabled: false
    },
    stroke: {
        curve: 'smooth'
    },
    title: {
        text: "endpoint = 'wss://stream.binance.com:9443/ws/!miniTicker@arr'",
        align: 'left'
    },
    markers: {
        size: 0
    },
    xaxis: {
        type: 'datetime',
        range: XAXISRANGE,
    },
    // yaxis: {
    //     labels: {
    //         formatter: function (val) {
    //             return val.toFixed(2);
    //         }
    //     }
    // },
    // yaxis: {
    //     max: 65000,
    //     min: 60000,
    // },
    legend: {
        show: false
    },
};

var real_chart = new ApexCharts(document.querySelector("#real_time_line"), real_time_options);
real_chart.render();



function updateYAxis(chart, price) {
    // Calculate new y-axis bounds
    var minY = price - 150;
    var maxY = price + 150;

    // Round minY and maxY to 2 decimal places
    minY = parseFloat(minY.toFixed(2));
    maxY = parseFloat(maxY.toFixed(2));

    // Ensure minY is not less than 0
    if (minY < 0) {
        minY = 0;
    }

    // Log the new y-axis range for debugging
    //console.log('Updating y-axis with price:', price);
    //console.log('New y-axis range:', minY, maxY);

    // Update the y-axis range
    chart.updateOptions({
        yaxis: {
            min: minY,
            max: maxY
        }
    });
}



// Function to update y-axis dynamically
//function updateYAxis(chart, price) {
    // Log the price value to ensure it's correct
  //  console.log('Updating y-axis with price:', price);
    
    //var minY = price - 150.00;
    //var maxY = price + 250.00;

    // Round minY and maxY to 2 decimal places
    //minY = Math.round(minY * 100) / 100;
    //maxY = Math.round(maxY * 100) / 100;

    // Log the new y-axis range
    //console.log('New y-axis range:', minY, maxY);
    
    //chart.updateOptions({
    //    yaxis: {
    //        min: minY,
    //        max: maxY,
    //    }
   // });
 // }

// Function to convert epoch timestamp to a formatted date string
function formatDate(epochTimestamp) {
    // Subtract 3 hours (180 minutes) in milliseconds
    var gmtMinus0300Offset = 180 * 60 * 1000;
    // Create a new Date object with the epoch timestamp (in milliseconds)
    var date = new Date(epochTimestamp + gmtMinus0300Offset);
    // Get the individual components of the date
    var year = date.getFullYear();
    var month = ('0' + (date.getMonth() + 1)).slice(-2); // Months are zero-based
    var day = ('0' + date.getDate()).slice(-2);
    var hours = ('0' + date.getHours()).slice(-2);
    var minutes = ('0' + date.getMinutes()).slice(-2);
    var seconds = ('0' + date.getSeconds()).slice(-2);
    // Construct the formatted date string in the desired format
    var formattedDate = year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;
    return formattedDate;
}
