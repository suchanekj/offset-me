
d3.text("payments.csv", function(data) {
    var parsedCSV = d3.csv.parse(data);

    var offset_rows = d3.select("#offset-rows")

        .selectAll("div")
        .data(parsedCSV).enter()
        .append("div")
        .attr("class", function(d) {
            return "form-row form-lvl" + d.ID.replace(/[^0-9]/g,"").length
        })
        .attr("id", function(d) {return d.ID});

    offset_rows.append("div")
        .attr("class", "form-text")
        .text(function(d) {return d.Name + ":"});

    offset_rows.append("div")
        .attr("class", "slider-container")
        .append("input")
        .attr("class", "slider")
        .attr("id", function(d) {return "sld-" + d.ID})
        .attr("type", "range")
        .attr("min", "0")
        .attr("max", function(d) {return d.Max})
        .attr("step", function(d) {return d.Max / 1000})
        .attr("value", function(d) {return d.Mid});

    offset_rows.append("div")
        .attr("class", "form-value");

    offset_rows.append("div")
        .attr("class", "slider-button")
        .append("button")
        .attr("onclick", function(d) {return "sliderButton('" + d.ID + "')"})
        .attr("class", "btn")
        .append("span")
        .text("more");

    var sliders = $("[id^=sld-]");

    for (slider of sliders) {
        (function() {
            var output = slider.parentElement.parentElement.children[2];
            slider.oninput = function () {
                equalizeSliders(this.id);
                output.innerHTML = this.value;
                updateDonation();
            }
            equalizeSliders(slider.id);
            output.innerHTML = slider.value;
        })();
    }
});

function sliderButton(id) {
    var more = true;
    for (i = 0; i < 10; i++) {
        var x = $("[id=" + id + i + "]");
        if (x.length === 0) continue;
        if (x.css('display') === "none") {
            x.css('display', 'flex');
            more = false;
            if ($("[id^=" + id + i + "]").length === 1) {
                x[0].children[3].style = "visibility: hidden";
            }
        } else {
            var btns = $("[id^=" + id + i + "]");
            btns.css('display', 'none');
            for (btn of btns) {
                btn.children[3].children[0].innerHTML = "<span>more</span>";
            }
        }
    }
    this_btn = $("[id=" + id + "]")[0];
    if (more) {
        this_btn.children[3].children[0].innerHTML = "<span>more</span>";
    } else {
        this_btn.children[3].children[0].innerHTML = "<span>less</span>";
    }
}

function equalizeSliders(id) {
    var sum = 0
    for (i = 0; i < 10; i++) {
        var x = $("[id=" + id.slice(0, id.length - 1) + i + "]");
        if (x.length === 0) continue;
        sum += Number(x[0].value);
    }
    var static_value = Number($("[id=" + id + "]")[0].value);
    var multiplier = (1 - static_value) / (sum - static_value);
    for (i = 0; i < 10; i++) {
        var x = $("[id=" + id.slice(0, id.length - 1) + i + "]");
        if (x.length === 0) continue;
        if (x[0].id === id) continue;
        x[0].value = x[0].value * multiplier;
        var output = x[0].parentElement.parentElement.children[2];
        output.innerHTML = x[0].value;
    }
}

var donationValues = {}

function multiplyDonation(id, parsedCSV, charity_names) {
    var donationMultipliers = null;
    for (var i = 0; i < 10; i++) {
        var x = $("[id=" + id + i + "]");
        if (x.length === 0) continue;
        var childDonationMultipliers;
        if (donationMultipliers === null) {
            donationMultipliers = {};
            childDonationMultipliers = multiplyDonation(
                id + i, parsedCSV, charity_names
            );
            for (charity_name of charity_names) {
                donationMultipliers[charity_name] = childDonationMultipliers[charity_name];
            }
        } else {
            childDonationMultipliers = multiplyDonation(
                id + i, parsedCSV, charity_names
            );
            for (charity_name of charity_names) {
                donationMultipliers[charity_name] += childDonationMultipliers[charity_name];
            }
        }
    }
    var row;
    for (csv_row of parsedCSV) {
        if (id === csv_row.ID) {
            row = csv_row;
            break;
        }
    }
    if (donationMultipliers === null) {
        donationMultipliers = {};
        for (charity_name of charity_names) {
            donationMultipliers[charity_name] = 1;
        }
    }
    for (charity_name of charity_names) {
        donationMultipliers[charity_name] *= row[charity_name] * $("[id=sld-" + id + "]")[0].value;
    }
    return donationMultipliers;
}

var csvData

d3.text("payments.csv", function (data) {
    csvData = data;
});

function updateDonation() {
    var parsedCSV = d3.csv.parse(csvData);

    var charity_names = d3.csv.parseRows(csvData)[0];
    charity_names.splice(0, 6);

    for (charity_name of charity_names) {
        donationValues[charity_name] = 0;
    }

    for (csv_row of parsedCSV) {
        if (csv_row.ID.replace(/[^0-9]/g,"").length === 0) {
            var rowDonationValues = multiplyDonation(csv_row.ID, parsedCSV, charity_names);

            for (charity_name of charity_names) {
                donationValues[charity_name] += rowDonationValues[charity_name];
            }
        }
    }

    var sortedDonationValues = [];
    for (charity_name in donationValues) {
        sortedDonationValues.push([Number(donationValues[charity_name]), charity_name]);
    }
    sortedDonationValues.sort().reverse();
    var donationsSum = 0;
    var donationsTable = "";
    for (var charityValue of sortedDonationValues) {
        donationsTable += '<tr class="donations-table-row">';
        donationsTable += "<td>" + charityValue[1] + "</td>";
        donationsTable += "<td>" + charityValue[0].toFixed(2) + "</td>";
        donationsTable += '</tr>\n';
        donationsSum += charityValue[0];
    }
    $("[id=donations-table]")[0].innerHTML = donationsTable;

    $("[id=donation-sum]")[0].innerHTML = donationsSum.toFixed(2);
}

function showDonation() {
    updateDonation();

    var x = $("[id=donations-table]");
    if (x.css('display') === "none") {
        x.css('display', 'flex');
    } else {
        x.css('display', 'none');
    }
}

function submitDonation() {

}
