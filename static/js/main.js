// 取得主繪製區域
const chart1 = echarts.init(document.getElementById('main'));
const chart2 = echarts.init(document.getElementById('six'));
const chart3 = echarts.init(document.getElementById('county'));





$("#update").click(() => {
    console.log("click!");
    drawPM25();
});


//select 選擇option時的變動監聽 (Flask語法 val是value)
$("#select_county").change(() => {
    county = $("#select_county").val();
    console.log(county);
    drawCountyPM25(county);
});

//按照網頁大小縮放
window.onresize = function () {
    chart1.resize();
    chart2.resize();
    chart3.resize();
};





// 呼叫後端資料跟繪製
drawPM25();

function drawCountyPM25(county) {
    chart3.showLoading();
    $.ajax(
        {
            url: `/county-pm25-data/${county}`,
            type: "GET",
            dataType: "json",
            success: (result) => {
                drawChat(chart3, county, "PM2.5", result["site"], result["pm25"]);
                chart3.hideLoading();
            },
            //if fail
            error: () => {
                alert("Loading Failed, Please Try Again Later!");
                chart3.hideLoading();
            }
        }
    )
}




// 取得後端資料
function drawSixPM25() {
    chart2.showLoading();
    $.ajax(
        {
            url: "/six-pm25-data",
            type: "GET",
            dataType: "json",
            success: (result) => {
                drawChat(chart2, "六都平均值", "PM2.5", result["site"], result["pm25"], '#ffc0cb');
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
                this.setTimeout(() => {
                    //因為我們做的highest&lowest字典中還有字典，所以要用中括弧 第一個放第一個highest:第二個放highest:site
                    $("#pm25_high_site").text(result["highest"]["site"]);
                    $("#pm25_high_site").text(result["highest"]["pm25"]);
                    $("#pm25_low_site").text(result["lowest"]["site"]);
                    $("#pm25_low_site").text(result["lowest"]["pm25"]);
                    //更簡潔:  $("#pm25_high_site").text(result["highest"]["site"])
                    //前提是要有引用jquery

                    //console.log(result);
                    //繪製對應區塊並給予必要參數
                    drawChat(chart1, result["datetime"], "PM2.5", result["site"], result["pm25"], '#98fb98');
                    chart1.hideLoading();
                    drawSixPM25();
                    drawCountyPM25("彰化縣");
                }, 1000)
            },
            //if fail
            error: () => {
                alert("Loading Failed, Please Try Again Later!");
                chart1.hideLoading();
            }
        }
    )
}

function drawChat(chart, title, legend, xData, yData, color = '#afeeee') {
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
                data: yData,
                //客製化顏色
                itemStyle: {
                    color: color
                }
            }
        ]
    };

    chart.setOption(option);
}




