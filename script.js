// Photos taken per month, Nov 2025 – Oct 2026 (from my camera roll)
const data = [
  { month: "Nov ’25", count: 156, note: "College plus a weekend visiting friends at their school." },
  { month: "Dec ’25", count: 94,  note: "An uneventful winter break." },
  { month: "Jan ’26", count: 98,  note: "Winter break wrapping up and a new semester, this time on co-op!" },
  { month: "Feb ’26", count: 75,  note: "Super busy month, the fewest photos all year." },
  { month: "Mar ’26", count: 110, note: "A dance competition weekend and a trip to Chicago." },
  { month: "Apr ’26", count: 108, note: "A steady month in Boston, working everyday." },
  { month: "May ’26", count: 166, note: "Last week of the semester, Acadia National Park, and a friend’s birthday dinner." },
  { month: "Jun ’26", count: 124, note: "Summer outings with friends and a family engagement party, but still working." },
  { month: "Jul ’26", count: 140, note: "Summer outings, and friends came to visit. Again, still working!" },
  { month: "Aug ’26", count: 514, note: "Summer! A wedding in New Jersey, a friend visit, family birthdays, and mostly the San Francisco trip.", highlight: true },
  { month: "Sep ’26", count: 177, note: "Back at college: housewarmings, birthday parties, and a club event." },
  { month: "Oct ’26", count: 426, note: "Dance team photoshoot, garba, Halloween, and a family party." }
];

function drawChart() {
  const container = d3.select("#chart");
  container.selectAll("*").remove();

  const width = 760;
  const height = 420;
  const margin = { top: 28, right: 16, bottom: 56, left: 56 };

  const svg = container.append("svg")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("preserveAspectRatio", "xMidYMid meet");

  const x = d3.scaleBand()
    .domain(data.map(d => d.month))
    .range([margin.left, width - margin.right])
    .padding(0.2);

  const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.count) * 1.1])
    .nice()
    .range([height - margin.bottom, margin.top]);

  // Axes
  svg.append("g")
    .attr("class", "axis")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x).tickSizeOuter(0));

  svg.append("g")
    .attr("class", "axis")
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y).ticks(6).tickSizeOuter(0));

  svg.append("text")
    .attr("class", "axis-title")
    .attr("transform", "rotate(-90)")
    .attr("x", -(height - margin.bottom + margin.top) / 2)
    .attr("y", 14)
    .text("Photos taken");

  // Tooltip
  const tooltip = container.append("div").attr("class", "tooltip");

  function showTip(event, d) {
    const box = container.node().getBoundingClientRect();
    tooltip
      .html(`<strong>${d.month}: ${d.count} photos</strong><br>${d.note}`)
      .style("left", `${Math.min(event.clientX - box.left + 12, box.width - 230)}px`)
      .style("top", `${event.clientY - box.top - 70}px`)
      .style("opacity", 1);
  }
  function hideTip() { tooltip.style("opacity", 0); }

  // Bars
  svg.selectAll(".bar")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", d => d.highlight ? "bar highlight" : "bar")
    .attr("x", d => x(d.month))
    .attr("y", d => y(d.count))
    .attr("width", x.bandwidth())
    .attr("height", d => y(0) - y(d.count))
    .attr("rx", 3)
    .attr("tabindex", 0)
    .on("mousemove", showTip)
    .on("mouseleave", hideTip)
    .on("focus", (event, d) => {
      const r = event.target.getBoundingClientRect();
      showTip({ clientX: r.left + r.width / 2, clientY: r.top }, d);
    })
    .on("blur", hideTip);

  // Value labels
  svg.selectAll(".bar-label")
    .data(data)
    .enter()
    .append("text")
    .attr("class", "bar-label")
    .attr("x", d => x(d.month) + x.bandwidth() / 2)
    .attr("y", d => y(d.count) - 6)
    .text(d => d.count);
}

drawChart();