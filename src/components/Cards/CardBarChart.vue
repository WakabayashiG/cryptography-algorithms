<template>

	<!-- Active Users Card -->
	<a-card :bordered="false" class="dashboard-bar-chart">
    <div class="card-title">
      <h6>Frequency Analysis</h6>
      <p>The frequencies of the cipher text above:</p>
    </div>
		<chart-bar :height="220" :data="barChartData"></chart-bar>
	</a-card>
	<!-- Active Users Card -->

</template>

<script>

	// Bar chart for "Active Users" card.
	import ChartBar from '../Charts/ChartBar' ;
  import {getLettersMap} from "@/utils/lettersMap";

	export default {

    props: {
      chartData: Array,
    },

		components: {
			ChartBar,
		},
		data() {
			return {
				// Data for bar chart.
				barChartData: {
					labels: Object.keys(getLettersMap()),
					datasets: [{
						label: "Count",
						backgroundColor: '#fff',
						borderWidth: 0,
						borderSkipped: false,
						borderRadius: 6,
						data: this.chartData,
						maxBarThickness: 20,
					}, ],
				},
			}
		},
	}

</script>