import "./styles/App.css";
import DateRangePicker from "./components/DateRangePicker";

export default function App() {
	// the parameters 'startAndEndDates', 'weekends' in onDateRangeSelect will contain an arrary
	// startAndEndDates[0] ===> startDate
	// startAndEndDates[1] ===> endDate
	// weekends with contain the weekends between the range
	const onDateRangeSelect = (startAndEndDates: [Date, Date], weekends: Date[]) => {
		console.log("Start Date: ", startAndEndDates[0]);
		console.log("End Date: ", startAndEndDates[1]);
		console.log("Weekends: ", weekends);
	};
	return (
		<main>
			{/* 
			predifinedRanges accepts an array of 4 values
			i.e,
			positive X means next X days;
			negative X means last X days;
			0 means current day
			 */}
			{/* 
				Note: weekends are not handled in predefined cases
				because I am confused for 'today', 'yesterday', and for 'tomorrow' cases
				Whenever we click on predifined buttons 
				it can select weekend as start date and end date
			*/}
			<DateRangePicker onDateRangeSelect={onDateRangeSelect} predefinedRanges={[-1, 0, -7, 30]} />
		</main>
	);
}
