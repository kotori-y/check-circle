/*
 * @Description:
 * @Author: Kotori Y
 * @Date: 2021-06-18 20:09:30
 * @LastEditors: Kotori Y
 * @LastEditTime: 2021-06-25 16:52:34
 * @FilePath: \check-circle\static\scripts\renderCircle.js
 * @AuthorMail: kotori@cbdd.me
 */

const genCircleData = (data) => {
//   const addNodes = (graph, node) => {
//     if (graph.nodes.indexOf(node) === -1) {
//       graph.nodes.push(node);
//     }
//     return;
//   };

  const colorConfig = {
    level: new Map([
      ["Major", "#a8456b"],
      ["Moderate", "#ddc871"],
      ["Minor", "#83a78d"],
      ["Unknown", "#b6b2b2"],
    ]),
    nodes: ["#c5708b", "#83a78d", "#619ac3", "#ddc871", "#8076a3"],
  };

  const graph = { nodes: data.nodes, links: [] };

  for (const interaction of data.links) {
    const drugA = interaction.drugA,
      drugB = interaction.drugB,
      level = interaction.level,
      querySelector = interaction.querySelector;

    // addNodes(graph, drugA);
    // addNodes(graph, drugB);
    graph.links.push({
      source: drugA,
      target: drugB,
      lineStyle: {
        color: colorConfig.level.get(level),
        width: 5,
      },
      tooltip: {
        formatter: `<strong>${level}</strong> <br \>
        ${drugA} <i class="fad fa-repeat"></i> ${drugB}`,
        backgroundColor: colorConfig.level.get(level),
        textStyle: {
          color: "white",
        },
      },
      querySelector: querySelector,
    });
  }

  graph.nodes = graph.nodes.map((node, i) => {
    return {
      name: node,
      symbolSize: 100,
      itemStyle: {
        color: colorConfig.nodes[i],
        borderColor: "white",
        borderWidth: 10,
        shadowColor: "rgba(0, 0, 0, 0.5)",
        shadowBlur: 5,
      },
      tooltip: {
        formatter: "{b}",
        backgroundColor: "inherit",
        borderColor: "inherit",
      },
    };
  });

  return graph;
};

const renderCircle = (data) => {
  const graph = genCircleData(data);

  var chartDom = document.getElementById("circlePlot");
  var myChart = echarts.init(chartDom);
  var option;

  myChart.showLoading();

  myChart.hideLoading();

  graph.nodes.forEach(function (node) {
    node.label = {
      show: true,
    };
  });
  // console.log(graph);

  option = {
    title: {
      text: "Interaction Checker Result",
      // subtext: "Circular layout",
      top: "bottom",
      left: "right",
    },
    tooltip: {},
    animationDurationUpdate: 750,
    animationEasingUpdate: "quinticInOut",
    series: [
      {
        name: "Interaction Checker Result",
        type: "graph",
        layout: "circular",
        force: { repulsion: 100 },
        // circular: {
        //   rotateLabel: true,
        // },
        data: graph.nodes,
        links: graph.links,
        roam: false,
        label: {
          position: "inside",
          formatter: "{b}",
          width: 80,
          overflow: "truncate",
          fontSize: 15,
        },
        lineStyle: {
          color: "source",
          curveness: 0.3,
        },
        emphasis: {
          focus: "adjacency",
          lineStyle: {
            width: 10,
          },
        },
      },
    ],
  };

  
  myChart.on("click", (params) => {
    const elem = $(params.data.querySelector)
    if (elem.length > 0) {
      elem.removeClass("focus")
      $('html, body').animate({
        scrollTop: elem.offset().top
    }, 800);
    elem.addClass("focus")
    }
  });

  option && myChart.setOption(option);
};
