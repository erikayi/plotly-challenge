
function buildPlot(BellyButtonData) {

    // Fetch the JSON data and console log it
    d3.json("../../samples.json").then(function(data) {
    console.log(data);

    var ethnicity = data.metadata.map(race => race.ethnicity);
    console.log(`Ethnicities: ${ethnicity}`);

    var bbtype = data.metadata.map(bb => bb.bbtype);
    console.log(`Belly Button Types: ${bbtype}`);

    // Filter by ids
    var sample_values = data.samples.filter(sampleid => sampleid.id);
    console.log(sample_values);

    // Select one of the samples from the array
    var oneSample = sample_values[6];
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
        xaxis: {title: "OTU ID"},
        showlegend: false
      };
      
      Plotly.newPlot('bubble', data, layout);

      // create gauge chart for washing frequency of the individual 

      var washingfreq = data.metadata.map(wf => wf.wfreq);
      console.log(`Washing Frequency: ${washingfreq}`);

      var washingdata = [
        {
          domain: { x: [0, 1], y: [0, 1] },
          value: washingfreq,
          title: { text: "Belly Button Washing Frequency" },
          subtitle: { text: "Scrubs per Week"},
          type: "indicator",
          mode: "gauge+number+delta",
          delta: { reference: washingfreq },
          gauge: {
            axis: { range: [null, 10] },
            steps: [
              { range: [0, 1], color: "lightbeige" },
              { range: [1, 2], color: "beige" },
              { range: [2, 3], color: "lightyellow" },
              { range: [3, 4], color: "lightgreenyellow" },
              { range: [4, 5], color: "lightgreen" },
              { range: [5, 6], color: "green" },
              { range: [6, 7], color: "lightbluegreen" },
              { range: [7, 8], color: "bluegreen" },
              { range: [8, 9], color: "blue"}
            ],
            threshold: {
              line: { color: "red", width: 4 },
              thickness: 0.75,
              value: washingfreq
            }
          }
        }
      ];
      
      var layout = { width: 600, height: 450, margin: { t: 0, b: 0 } };
      Plotly.newPlot('gauge', washingdata, layout);

});

};


// Display the sample metadata, for example, an individual's demographic info

// Display each key-value pair from the metadata JSON object on the page

// Update all of the plots any time that new sample is selected

buildPlot();
