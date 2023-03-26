<template>

	<!-- Active Users Card -->
	<a-card :bordered="false" class="dashboard-bar-chart">
    <div class="card-title">
      <h6>Frequency Analysis</h6>
      <p>The frequencies of the cipher text above:</p>
    </div>
		<chart-bar :height="220" :data="barChartData"></chart-bar>
		<div class="card-content">
			<p>We have created multiple options for you to put together and customise into pixel perfect pages.</p>
		</div>
		<a-row class="card-footer" type="flex" justify="center" align="top">
			<a-col :span="6">
				<h4>3,6K</h4>
				<span>Users</span>
			</a-col>
			<a-col :span="6">
				<h4>2m</h4>
				<span>Clicks</span>
			</a-col>
			<a-col :span="6">
				<h4>$772</h4>
				<span>Sales</span>
			</a-col>
			<a-col :span="6">
				<h4>82</h4>
				<span>Items</span>
			</a-col>
		</a-row>
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