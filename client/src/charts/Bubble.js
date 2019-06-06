import React, { useEffect } from "react";
import * as d3 from "d3";

function Bubble(props) {
  const { apiData } = props;
  useEffect(() => {
    if (!apiData.length) {
      return;
    }
    const margin = { left: 80, right: 20, top: 50, bottom: 100 };
    const height = 500 - margin.top - margin.bottom;
    const width = 800 - margin.left - margin.right;

    const g = d3
      .select("#bubble")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

    let time = 0;

    const x = d3
      .scaleLog()
      .base(10)
      .range([0, width])
      .domain([142, 150000]);
    const y = d3
      .scaleLinear()
      .range([height, 0])
      .domain([0, 90]);
    const area = d3
      .scaleLinear()
      .range([25 * Math.PI, 1500 * Math.PI])
      .domain([2000, 1400000000]);
    const continentColor = d3.scaleOrdinal(d3.schemePastel1);

    const xLabel = g
      .append("text")
      .attr("y", height + 50)
      .attr("x", width / 2)
      .attr("font-size", "20px")
      .attr("text-anchor", "middle")
      .text("GDP Per Capita ($)");
    const yLabel = g
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -40)
      .attr("x", -170)
      .attr("font-size", "20px")
      .attr("text-anchor", "middle")
      .text("Life Expectancy (Years)");
    const timeLabel = g
      .append("text")
      .attr("y", height - 10)
      .attr("x", width - 40)
      .attr("font-size", "40px")
      .attr("opacity", "0.4")
      .attr("text-anchor", "middle")
      .text("1800");

    const xAxisCall = d3
      .axisBottom(x)
      .tickValues([400, 4000, 40000])
      .tickFormat(d3.format("$"));
    g.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxisCall);

    const yAxisCall = d3.axisLeft(y).tickFormat(d => {
      return +d;
    });
    g.append("g")
      .attr("class", "y axis")
      .call(yAxisCall);

    const continents = ["europe", "asia", "americas", "africa"];
    const legend = g
      .append("g")
      .attr("transform", `translate(${width - 10}, ${height - 125})`);

    continents.forEach((continent, i) => {
      let legendRow = legend
        .append("g")
        .attr("transform", `translate(0, ${i * 20})`);

      legendRow
        .append("rect")
        .attr("width", 10)
        .attr("height", 10)
        .attr("fill", continentColor(continent));

      legendRow
        .append("text")
        .attr("x", -10)
        .attr("y", 10)
        .attr("text-anchor", "end")
        .style("text-transform", "capitalize")
        .text(continent);
    });
    const formattedData = apiData.map(year => {
      return year["countries"]
        .filter(country => {
          const dataExists = country.income && country.life_exp;
          return dataExists;
        })
        .map(country => {
          country.income = +country.income;
          country.life_exp = +country.life_exp;
          return country;
        });
    });

    d3.interval(() => {
      time = time < 214 ? time + 1 : 0;
      update(formattedData[time]);
    }, 100);
    update(formattedData[0]);

    function update(data) {
      const t = d3.transition().duration(100);

      const circles = g.selectAll("circle").data(data, d => {
        return d.country;
      });

      circles
        .exit()
        .attr("class", "exit")
        .remove();

      circles
        .enter()
        .append("circle")
        .attr("class", "enter")
        .attr("fill", d => {
          return continentColor(d.continent);
        })
        .merge(circles)
        .transition(t)
        .attr("cy", d => {
          return y(d.life_exp);
        })
        .attr("cx", d => {
          return x(d.income);
        })
        .attr("r", d => {
          return Math.sqrt(area(d.population) / Math.PI);
        });

      timeLabel.text(+(time + 1800));
    }
  });
  return (
    <div className="bubble-chart">
      <svg id="bubble" width="800" height="500" />
    </div>
  );
}

export default Bubble;
