$(document).ready(function () {
    buildCharts('/charts/phis_osoba.csv', 'Открытие/закрытие клиентов Предпринимателей по дням', 'container1');
    buildCharts('/charts/ur_osoba.csv', 'Открытие/закрытие клиентов UR по дням', 'container2');
});

function buildCharts(filename, title, container) {
    Highcharts.ajax({
        url: filename,
        dataType: 'text',
        success: function(data) {
            // Split the lines
            var lines = data.split('\n');

            var options = {
                chart: {
                    type: 'column'
                },
                title: {
                    text: title
                },
                xAxis: {
                    categories: [],
                    labels: {
                        rotation: -90
                    }
                },
                yAxis: {
                    title: {
                        text: 'Кол-во клиентов'
                    },
                    stackLabels: {
                        enabled: true,
                        style: {
                            fontWeight: 'bold',
                            color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
                        }
                    }
                },
                legend: {
                    align: 'right',
                    x: -30,
                    verticalAlign: 'top',
                    y: 25,
                    floating: true,
                    backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white',
                    borderColor: '#CCC',
                    borderWidth: 1,
                    shadow: false
                },
                tooltip: {
                    headerFormat: '<b>{point.x}</b><br/>',
                    pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
                },
                plotOptions: {
                    column: {
                        stacking: 'normal',
                        dataLabels: {
                            enabled: true,
                            align: 'left',
                            color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white'
                        }
                    }
                },
                credits: {
                    enabled: false
                },
                series: []
            };
            var item_categories = [];

            item_categories = (lines[0].substring(1, lines[0].length - 1)).split(',');
            item_categories = item_categories.concat((lines[2].substring(1, lines[2].length - 1)).split(','));
            item_categories = item_categories.concat((lines[4].substring(1, lines[4].length - 1)).split(','));
            item_categories.forEach(function (item) {
                item = item.trim();
                if ($.inArray(item, options.xAxis.categories) === -1) {
                    options.xAxis.categories.push(item);
                }
            });
            options.xAxis.categories.sort();
            lines.forEach(function(line, lineNo) {
                var amounts;
                var series;
                switch (lineNo) {
                    case 0:           //categories of accounts created on dates using site
                        series = {
                            name: 'Открыли (сайт)',
                            data: []
                        };

                        item_categories = (lines[0].substring(1, lines[0].length - 1)).split(',');
                        amounts = (lines[1].substring(1, lines[1].length - 1)).split(',');

                        item_categories.forEach(function (item, itemNo) {
                            item = item.trim();
                            series.data.push([$.inArray(item, options.xAxis.categories), parseInt(amounts[itemNo], 10)]);
                        });
                        options.series.push(series);
                        break;
                    case 2:            //categories of accounts created on dates using branch
                        series = {
                            name: 'Открыли (бранч)',
                            data: []
                        };

                        item_categories = (lines[2].substring(1, lines[2].length - 1)).split(',');
                        amounts = (lines[3].substring(1, lines[3].length - 1)).split(',');

                        item_categories.forEach(function (item, itemNo) {
                            item = item.trim();
                            series.data.push([$.inArray(item, options.xAxis.categories), parseInt(amounts[itemNo], 10)]);
                        });
                        options.series.push(series);
                        break;
                    case 4:            //categories of closed accounts
                        series = {
                            name: 'Закрыли счёт',
                            data: []
                        };

                        item_categories = (lines[4].substring(1, lines[4].length - 1)).split(',');
                        amounts = (lines[5].substring(1, lines[5].length - 1)).split(',');

                        item_categories.forEach(function (item, itemNo) {
                            item = item.trim();
                            series.data.push([$.inArray(item, options.xAxis.categories), -parseInt(amounts[itemNo], 10)]);
                        });
                        options.series.push(series);
                        break;
                }
            });
            // console.log(options.xAxis.categories);
            // options.xAxis.categories.sort();
            // console.log(options.xAxis.categories);

            Highcharts.chart(container, options);
        },
        error: function (e, t) {
            console.error(e, t);
        }
    });
}
