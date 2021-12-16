$(function () {
    // $( "#progressbar" ).show();

    $("#search, #about, #liveReports").hide();
        $.ajax({
            url:`https://api.coingecko.com/api/v3/coins`,
            success: coins => displayCoins(coins),
            error: err => alert(err.status)
    });

    function displayCoins(coins) {
        for (coin of coins){
            const $card = $(`<div class="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 divStyle" id="${coin.symbol}">
                                <div id="divSymbol">${coin.symbol}
                                    <label class="switch">
                                    <input type="checkbox" id="${coin.id}" name="${coin.symbol}">
                                    <span class="slider round"></span>
                                    </label>
                                </div>
                                <br/>
                                <div id="divId">${coin.id}</div>
                                <br/>
                                <button type="button" class="collapsible" id="moreInfoButton" name="${coin.id}">More Info</button>
                                <div class="content">
                                    <p></p>
                                </div>
                            </div>`);
            $card.find("#moreInfoButton").on("click", function () {
                moreInfoFunction(this);
            });
            $card.find("input[type=checkbox]").on("click", function () {
                toggle(this);
            });
            $("#home").append($card);
        }
        var coll = document.getElementsByClassName("collapsible");
        var i;
        for (i = 0; i < coll.length; i++) {
        coll[i].addEventListener("click", function() {
            this.classList.toggle("active");
            var content = this.nextElementSibling;
            if (content.style.display === "block") {
            content.style.display = "none";
            } else {
            content.style.display = "block";
            }
        });
        }
    }
    //More info func, gets info from API and saves for 2 min on sessionStorage, then display from session
    function moreInfoFunction(button) {
        const id = button.name;
        console.log("button.name: " + button.name);
        const idToGet = sessionStorage.getItem(`${id}`);
        const idToCheck = JSON.parse(idToGet);
        if (idToCheck == null){
            console.log("to check: " + idToCheck);
            asyncMoreInfo(id);
        } else {
            $(`button[name=${id}]`).next().html(`<div><img src="${idToCheck.Thumb}">
                                                USD: ${idToCheck.USD}
                                                EUR: ${idToCheck.EUR}
                                                ILS: ${idToCheck.ILS}</div>`);
        }
    }
    async function asyncMoreInfo(id) {
            try {
                const coinsMoreInfo = await getDataAsync(`https://api.coingecko.com/api/v3/coins/${id}`);
                $(`button[name=${id}]`).next().html(`<div><img src="${coinsMoreInfo.image.thumb}">
                                                    USD: ${coinsMoreInfo.market_data.current_price.usd}
                                                    EUR: ${coinsMoreInfo.market_data.current_price.eur}
                                                    ILS: ${coinsMoreInfo.market_data.current_price.ils}</div>`);
                                    const thumbToSave = coinsMoreInfo.image.thumb;
                                    const usdToSave = coinsMoreInfo.market_data.current_price.usd;
                                    const eurToSave = coinsMoreInfo.market_data.current_price.eur;
                                    const ilsToSave = coinsMoreInfo.market_data.current_price.ils;
                                    const idToUpload = {
                                        Thumb: thumbToSave,
                                        USD: usdToSave,
                                        EUR: eurToSave,
                                        ILS: ilsToSave,
                                    };
                                    const idString = JSON.stringify(idToUpload);
                                    sessionStorage.setItem(`${id}` , idString);
                                    setTimeout( () => sessionStorage.clear(`${id}`), 120000 )
                                }
            catch (err) {
                alert("Error: " + err.status);
            }
    }
    function getDataAsync(url) {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: url,
                success: data => resolve(data),
                reject: err => reject(err)
            });
        });
    }
    //Toggle button with 5 coins array and Modal display options
    const arr = [];
    function toggle(coin) {
        let index=0;
        if ($(`input[type="checkbox"][id="${coin.id}"]`).is(":checked")) {
            const coinArray = {id: coin.id,
                symbol: coin.name};
            if (arr.length < 5) {
                arr.push(coinArray);
                console.log(arr);
            } else {
                var modal = document.getElementById("myModal");
                modal.style.display = "block";
                    $(".modal-content").html(`<span class="close">&times;</span>
                                              <p>Sorry, you can't choose more then 5 coins</p>`);
                    for (let modalCoin of arr){
                        const $card = $(`<div class="divStyle" id="${modalCoin.symbol}">
                                            <div id="divSymbol">${modalCoin.symbol}
                                                <label class="switch">
                                                <input type="checkbox" id="${modalCoin.id}" checked="true" name="${modalCoin.symbol}">
                                                <span class="slider round"></span>
                                                </label>
                                            </div>
                                            <br/>
                                            <div id="divId">${modalCoin.id}</div>
                                            <br/>
                                            <button type="button" class="collapsible" id="moreInfoButton" name="${modalCoin.id}">More Info</button>
                                            <div class="content">
                                                <p></p>
                                            </div>
                                        </div>`);
                        $card.find("#moreInfoButton").on("click", function () {
                        moreInfoFunction(this);
                        });
                        $card.find("input[type=checkbox]").on("click", function () {
                        toggle(this);
                        });
                        $(".modal-content").append($card);
                    }
                    $(".modal-content").append(`<button id="cancelButton">cancel</button>`);
                    var coll = document.getElementsByClassName("collapsible");
                    var i;

                    for (i = 0; i < coll.length; i++) {
                    coll[i].addEventListener("click", function() {
                        this.classList.toggle("active");
                        var content = this.nextElementSibling;
                        if (content.style.display === "block") {
                        content.style.display = "none";
                        } else {
                        content.style.display = "block";
                        }
                    });
                    }
                    for (item of arr) {
                        if (coin.id === item.id) {
                            break;
                        }
                        index+=1;
                    }
                    arr.splice(index, 1);
                    console.log("after remove from modal");
                    console.log(arr);
                    $(`input[type="checkbox"][id="${coin.id}"]`).attr('checked', false);
                    // When the user clicks on Cancel Button, close the modal
                    $("#cancelButton").on("click", function() {
                        modal.style.display = "none";
                        $(".modal-content").html("");
                    });
                    // When the user clicks on <span> (x), close the modal
                    $("span.close").on("click", function() {
                        modal.style.display = "none";
                        $(".modal-content").html("");
                    });
                    // When the user clicks anywhere outside of the modal, close it
                    $(window).on("click", function(event) {
                        if (event.target == modal) {
                            modal.style.display = "none";
                            $(".modal-content").html("");
                        }
                    });
                }
        } else { 
            for (item of arr) {
                if (coin.id === item.id) {
                    break;
                }
                index+=1;
            }
            arr.splice(index, 1);
            console.log("after splice: ");
            console.log(arr);
            }
    }

    let meir;
    //chart func that compare between choosed coins and display their value in USD every 2 sec
    $("#liveReportsButton").on("click", function () {
        let str = "";
        for (let coin of arr) {
            str += coin.symbol + ",";
        }
        meir = setInterval( () => {
        $.ajax({
            url:`https://min-api.cryptocompare.com/data/pricemulti?fsyms=${str}&tsyms=USD`,
            success: cryptoCompare => displayCryptoCompare(cryptoCompare),
            error: err => alert(err.status)
        });
    }, 2000);
    displayChart();
    });
    let chartArray = [];
    function displayCryptoCompare(cryptoCompare) {
        chartArray = [];
        console.log(cryptoCompare);
        console.log(chartArray);
        let coin = "";
        for (coin in cryptoCompare) {
            chartArray.push(cryptoCompare[coin].USD)
        }
    }
    // Display Chart function, open once, updating every 2 sec from API and displaying updates on chart
    function displayChart() {
        var dataPoints1 = [];
        var dataPoints2 = [];
        var dataPoints3 = [];
        var dataPoints4 = [];
        var dataPoints5 = [];
        
        var options = {
            title: {
                text: "Live Updating Chart"
            },
            axisX: {
                title: "chart updates every 2 secs"
            },
            axisY: {
                suffix: "USD"
            },
            toolTip: {
                shared: false
            },
            legend: {
                cursor: "pointer",
                verticalAlign: "top",
                fontSize: 22,
                fontColor: "dimGrey",
                itemclick: toggleDataSeries
            },
            data: [{
                type: "line",
                xValueType: "dateTime",
                yValueFormatString: "###.00USD",
                xValueFormatString: "hh:mm:ss TT",
                dataPoints: dataPoints1
            }, {
                type: "line",
                xValueType: "dateTime",
                yValueFormatString: "###.00USD",
                dataPoints: dataPoints2
            }, {
                type: "line",
                xValueType: "dateTime",
                yValueFormatString: "###.00USD",
                dataPoints: dataPoints3
            }, {
                type: "line",
                xValueType: "dateTime",
                yValueFormatString: "###.00USD",
                dataPoints: dataPoints4
            }, {
                type: "line",
                xValueType: "dateTime",
                yValueFormatString: "###.00USD",
                dataPoints: dataPoints5
            }]
        };
        
       switch (chartArray.length ) {
           case 1: options.data[1].showInLegend, options.data[2].showInLegend, options.data[3].showInLegend, options.data[4].showInLegend = false;
           options.data[0].showInLegend = true;
           dataPoints2, dataPoints3, dataPoints4, dataPoints5 = [0];
           options.data[1].name, options.data[2].name, options.data[3].name, options.data[4].name = "";
           options.data[0].name = arr[0].symbol;
           break;
           case 2: options.data[2].showInLegend, options.data[3].showInLegend, options.data[4].showInLegend = false;
           options.data[0].showInLegend = true; 
           options.data[1].showInLegend = true;
           dataPoints3, dataPoints4, dataPoints5 = [0];
           options.data[2].name, options.data[3].name, options.data[4].name = "";
           options.data[0].name = arr[0].symbol; options.data[1].name = arr[1].symbol;
           break;
           case 3: options.data[3].showInLegend, options.data[4].showInLegend = false;
           options.data[0].showInLegend = true; 
           options.data[1].showInLegend = true;
           options.data[2].showInLegend = true;
           dataPoints4, dataPoints5 = [0];
           options.data[3].name, options.data[4].name = "";
           options.data[0].name = arr[0].symbol; options.data[1].name = arr[1].symbol; options.data[2].name = arr[2].symbol;
           break;
           case 4: options.data[4].showInLegend = false;
           options.data[0].showInLegend = true; 
           options.data[1].showInLegend = true;
           options.data[2].showInLegend = true;
           options.data[3].showInLegend = true;
           dataPoints5 = [0];
           options.data[4].name = "";
           options.data[0].name = arr[0].symbol; options.data[1].name = arr[1].symbol; options.data[2].name = arr[2].symbol; options.data[3].name = arr[3].symbol;
           break;
           case 5:
           options.data[0].name = arr[0].symbol; options.data[1].name = arr[1].symbol; options.data[2].name = arr[2].symbol; options.data[3].name = arr[3].symbol; options.data[4].name = arr[4].symbol;
           options.data[0].showInLegend = true; 
           options.data[1].showInLegend = true;
           options.data[2].showInLegend = true;
           options.data[3].showInLegend = true;
           options.data[4].showInLegend = true;
           break;
        }
        
        var chart = $("#liveReports").CanvasJSChart(options);
        
        function toggleDataSeries(e) {
            if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
                e.dataSeries.visible = false;
            }
            else {
                e.dataSeries.visible = true;
            }
            e.chart.render();
        }
        
        var updateInterval = 2000;
        
        var time = new Date;
        time.getHours(00);
        time.getMinutes(00);
        time.getSeconds(00);
        
        function updateChart(count) {
            count = count || 1;
            for (var i = 0; i < count; i++) {
                time.setTime(time.getTime() + updateInterval);
        
                // adding random value and rounding it to two digits. 
                var yValue1 = chartArray[0];
                var yValue2 = chartArray[1];
                var yValue3 = chartArray[2];
                var yValue4 = chartArray[3];
                var yValue5 = chartArray[4];
        
                // pushing the new values
                dataPoints1.push({
                    x: time.getTime(),
                    y: yValue1,
                });
                dataPoints2.push({
                    x: time.getTime(),
                    y: yValue2
                });
                dataPoints3.push({
                    x: time.getTime(),
                    y: yValue3
                });
                dataPoints4.push({
                    x: time.getTime(),
                    y: yValue4
                });
                dataPoints5.push({
                    x: time.getTime(),
                    y: yValue5
                });
            }
        
            switch (chartArray.length ) {
                case 1: 
                options.data[1].legendText, options.data[2].legendText, options.data[3].legendText, options.data[4].legendText = "";
                options.data[0].legendText = arr[0].symbol +" : " + yValue1 + "USD";
                break;
                case 2: 
                options.data[2].legendText, options.data[3].legendText, options.data[4].legendText = "";
                options.data[0].legendText = arr[0].symbol +" : " + yValue1 + "USD";
                options.data[1].legendText = arr[1].symbol +" : " + yValue2 + "USD";
                break;
                case 3: 
                options.data[3].legendText, options.data[4].legendText = "";
                options.data[0].legendText = arr[0].symbol +" : " + yValue1 + "USD";
                options.data[1].legendText = arr[1].symbol +" : " + yValue2 + "USD";
                options.data[2].legendText = arr[2].symbol +" : " + yValue3 + "USD";
                break;
                case 4: 
                options.data[4].legendText = "";
                options.data[0].legendText = arr[0].symbol +" : " + yValue1 + "USD";
                options.data[1].legendText = arr[1].symbol +" : " + yValue2 + "USD";
                options.data[2].legendText = arr[2].symbol +" : " + yValue3 + "USD";
                options.data[3].legendText = arr[3].symbol +" : " + yValue4 + "USD";
                break;
                case 5: 
                options.data[0].legendText = arr[0].symbol +" : " + yValue1 + "USD";
                options.data[1].legendText = arr[1].symbol +" : " + yValue2 + "USD";
                options.data[2].legendText = arr[2].symbol +" : " + yValue3 + "USD";
                options.data[3].legendText = arr[3].symbol +" : " + yValue4 + "USD";
                options.data[4].legendText = arr[4].symbol +" : " + yValue5 + "USD";
                break;
            }
            $("#liveReports").CanvasJSChart().render();
        }
        // generates first set of dataPoints
        updateChart(1);
        ben = setInterval(function () { updateChart() }, updateInterval);
    }

    let ben;
    // כפתור בית
    $("#homeButton").on("click", function () {
        $(".divStyle").show();
        $("#search, #liveReports, #about").hide();
        $(this).css({"background-color":"#2196F3","color":"white", "border-color": "#2196F3"});
        $("#liveReportsButton").css({"background-color":"white","color":"#2196F3", "border-color": "white"});
        $("#aboutButton").css({"background-color":"white","color":"#2196F3", "border-color": "white"});
        clearInterval(meir);
        clearInterval(ben);
        $("#liveReports").empty();
    });
    // כפתור דוחות
    $("#liveReportsButton").on("click", function () {
        $(".divStyle, #about, #search").hide();
        $("#liveReports").show();
        $(this).css({"background-color":"#2196F3","color":"white", "border-color": "#2196F3"});
        $("#homeButton").css({"background-color":"white","color":"#2196F3", "border-color": "white"});
        $("#aboutButton").css({"background-color":"white","color":"#2196F3", "border-color": "white"});
    });
    // כפתור אודות
    $("#aboutButton").on("click", function () {
        $(".divStyle, #liveReports, #search").hide();
        $("#about").show().html(`<div id="aboutDiv">
                                    <p>שם: מאיר בן יחיאל</p>
                                    <p>גיל: 35</p>
                                    <p>עיסוק: סטודנט</p>
                                    <p>עיר: חריש</p>
                                    <p>עולם הסחר הוירטואלי הפך להיות מאוד פופולארי בשנים האחרונות, יחד עם זאת נוצרו מגוון</p> 
                                    <p>שרתים המעניקים מידע חינמי אודות מצב המטבעות, מחיר, היסטוריה, מכירה קניה ועוד</p>
                                    <p>בפרויקט זה פיתחנו דף יחיד המנגיש לכם את המידע והדוחות מאותם שרתים</p>
                                </div>
                                <img id="myImage" src="MeirBenYechiel.jpg"/>`);
        $(this).css({"background-color":"#2196F3","color":"white", "border-color": "#2196F3"});
        $("#homeButton").css({"background-color":"white","color":"#2196F3", "border-color": "white"});
        $("#liveReportsButton").css({"background-color":"white","color":"#2196F3", "border-color": "white"});
    });
    // כפתור חיפוש
    $("#searchButton").on("click", function () {
        const value = $("#input").val();
        $(".divStyle, #liveReports, #about").hide(); // hide all but value
        $(`#${value}`).show();
        $("#input").val('');
        $("#homeButton").css({"background-color":"white","color":"#2196F3"});
        $("#liveReportsButton").css({"background-color":"white","color":"#2196F3"});
        $("#aboutButton").css({"background-color":"white","color":"#2196F3"});
    });
});