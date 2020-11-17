
function buildPlot(BellyButtonData) {

  // Fetch the JSON data and console log it
  d3.json("../../samples.json").then(function (data) {
    console.log(data);

    var ethnicity = data.metadata.map(race => race.ethnicity);
    console.log(`Ethnicities: ${ethnicity}`);

    var bbtype = data.metadata.map(bb => bb.bbtype);
    console.log(`Belly Button Types: ${bbtype}`);

    var washingfreq = data.metadata.map(wf => wf.wfreq);
    console.log(washingfreq);

    var race = data.metadata.map(race => race.ethnicity);
    console.log(race);

    // Filter by ids and convert object to string using toString()
    // Take a look at the documentation about toString: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/toString
    var sample = data.samples.filter(sampleid => sampleid.id.toString() === BellyButtonData);
    console.log(sample);

    // Select one of the samples from the array
    var oneSample = sample[0];
    console.log(oneSample);

    // get top 10 sample_values of an individual
    var top10values = oneSample.sample_values.slice(0, 10); // includes 0 and excluding 10 to get only top 10
    console.log(top10values);

    // reverse the data because we want the highest values on the top
    top10values.reverse();

    // get top 10 otu_ids of an individual 
    var top10otu_ids = oneSample.otu_ids.slice(0, 10);
    console.log(top10otu_ids);

    // reverse it here to match with the labels
    top10otu_ids.reverse();

    // get the labels for each OTU labels for bar chart 
    var otu_label = top10otu_ids.map(label => "OTU " + label);
    console.log(`OTU IDs: ${otu_label}`);

    // get top 10 labels for each values of OTUs
    var labels = oneSample.otu_labels.slice(0, 10);
    console.log(labels);

    // put in the bar chart
    var OTU_barChart = [{
      type: 'bar',
      x: top10values,
      y: otu_label,
      text: labels,
      orientation: 'h'
    }];

    Plotly.newPlot('bar', OTU_barChart);

    // make a bubble chart of each sample
    var trace1 = {
      x: oneSample.otu_ids,
      y: oneSample.sample_values,
      text: oneSample.otu_labels,
      mode: 'markers',
      marker: {
        color: oneSample.otu_ids,
        size: oneSample.sample_values,
        sizemode: 'area'
      }
    };

    var data = [trace1];

    var layout = {
      title: 'Sample Values vs. Each OTU IDs',
      xaxis: { title: "OTU ID" },
      showlegend: false
    };

    Plotly.newPlot('bubble', data, layout);

    // create gauge chart for washing frequency of the individual 

    var washingdata = [
      {
        domain: { x: [0, 1], y: [0, 1] },
        // Note: documentation on parseFloat: https://www.w3schools.com/jsref/jsref_parsefloat.asp
        value: parseFloat(washingfreq),
        title: { text: "Belly Button Washing Frequency" },
        type: "indicator",
        mode: "gauge+number",
        // delta: { reference: parseFloat(washingfreq) },
        hoverinfo: "labels",
        gauge: {
          axis: { range: [null, 9] },
          steps: [
            { range: [0, 1], color: "beige" },
            { range: [1, 2], color: "azure" },
            { range: [2, 3], color: "lightcyan" },
            { range: [3, 4], color: "powderblue" },
            { range: [4, 5], color: "lightblue" },
            { range: [5, 6], color: "lightskyblue" },
            { range: [6, 7], color: "lightsteelblue" },
            { range: [7, 8], color: "thistle" },
            { range: [8, 9], color: "plum" }
          ],
          threshold: {
            line: { color: "green", width: 5 },
            thickness: 1,
            value: parseFloat(washingfreq)
          }
        }
      }
    ]

    var layout = {
      width: 600,
      height: 450,
      margin: { t: 0, b: 0, r: 0, l: 0},
      "annotations": [
        {
          "text": "Scrubs per Week"
        },
      ]
    }

    Plotly.newPlot('gauge', washingdata, layout);

  })

}

// Display each key-value pair from the metadata JSON object on the page
// Update all of the plots any time that new sample is selected

function updatePlotly(BellyButtonData) {

  // Fetch the JSON data and console log it
  d3.json("../../samples.json").then((data) => {

    console.log(data);

    // Display the sample metadata, for example, an individual's demographic info
    var metadata = data.metadata;
    console.log(metadata);

    // Filter by ids and convert object to string 
    // Take a look at the documentation about toString: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/toString
    var demo_id = metadata.filter(meta => meta.id.toString() === BellyButtonData);
    console.log(demo_id);

    var demoIDvalue = demo_id[0];
    console.log(demoIDvalue);

    // Use D3 to select the demographic info
    var demoINFO = d3.select("#sample-metadata");

    // empty out demographic info each time selecting new data 
    demoINFO.html("");

    // grab demographic info by id and put values in the demographic table   
    Object.entries(demoIDvalue).forEach((value) => {
      demoINFO.append("h6")
              .text(value[0].toUpperCase() + ": " + value[1]);
    });
    
  });

}

// update all for the plots when a new sample is selected
function optionChanged(BellyButtonData){
  buildPlot(BellyButtonData);
  updatePlotly(BellyButtonData);
};

// Call updatePlotly() when a change takes place to the DOM
d3.selectAll("#selDataset").on("change", buildPlot, updatePlotly);

// This function is called when a dropdown menu item is selected
function init() {

  // read json data 
  d3.json("../../samples.json").then((data) => {
    console.log(data);

  // Use D3 to select the dropdown menu
  var dropdownMenu = d3.select("#selDataset");

  data.names.forEach(function(idName) {
    dropdownMenu.append("option")
                .text(idName)
                .property("value");
  })

  buildPlot(data.names[0]);
  updatePlotly(data.names[0]);

  })
}

init();
