// 取得主繪製區域
const chart1 = echarts.init(document.getElementById('main'));
const chart2 = echarts.init(document.getElementById('six'));





$("#update").click(() => {
    console.log("click!");
    drawPM25();
});

// 呼叫後端資料跟繪製
drawPM25();


// 取得後端資料
function drawSixPM25() {
    chart2.showLoading();
    $.ajax(
        {
            url: "/six-pm25-data",
            type: "GET",
            dataType: "json",
            success: (result) => {
                drawChat(chart2, "六都平均值", "PM2.5", result["site"], result["pm25"]);
                chart2.hideLoading();
            },
            //if fail
            error: () => {
                alert("Loading Failed, Please Try Again Later!");
                chart2.hideLoading();
            }
        }
    )
}
// 取得後端資料
function drawPM25() {
    chart1.showLoading();
    $.ajax(
        {
            url: "/pm25-data",
            type: "GET",
            dataType: "json",
            success: (result) => {

                //因為我們做的highest&lowest字典中還有字典，所以要用中括弧 第一個放第一個highest:第二個放highest:site
                $("#pm25_high_site").text(result["highest"]["site"]);
                $("#pm25_high_site").text(result["highest"]["pm25"]);
                $("#pm25_low_site").text(result["lowest"]["site"]);
                $("#pm25_low_site").text(result["lowest"]["pm25"]);
                //更簡潔:  $("#pm25_high_site").text(result["highest"]["site"])
                //前提是要有引用jquery

                //console.log(result);
                //繪製對應區塊並給予必要參數
                drawChat(chart1, result["datetime"], "PM2.5", result["site"], result["pm25"]);
                chart1.hideLoading();
                drawSixPM25();
            },
            //if fail
            error: () => {
                alert("Loading Failed, Please Try Again Later!");
                chart1.hideLoading();
            }
        }
    )
}

function drawChat(chart, title, legend, xData, yData) {
    let option = {
        title: {
            text: title
        },
        tooltip: {},
        legend: {
            data: [legend]
        },
        xAxis: {
            data: xData
        },
        yAxis: {},
        series: [
            {
                name: legend,
                type: 'bar',
                data: yData
            }
        ]
    };

    chart.setOption(option);
}





