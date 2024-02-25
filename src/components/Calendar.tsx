import "../styles/Calendar.css";
import { YearAndMonthType, getDaysInTheMonth, isWeekend } from "../utils/helper";

interface CalendarProps {
	monthAndYear: YearAndMonthType;
	onDateClick: (date: Date) => void;
	selectedStartDate: Date | null;
	selectedEndDate: Date | null;
	tempEndDate: Date | null;
	onMouseMoveHandler: (year: number, month: number, event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
	handleMonthChange: (isPreviousButton: boolean) => void;
	handleYearChange: (isPreviousButton: boolean) => void;
}

const Calendar: React.FC<CalendarProps> = ({ onDateClick, monthAndYear, selectedStartDate, selectedEndDate, tempEndDate, onMouseMoveHandler, handleMonthChange, handleYearChange }) => {
	const year = monthAndYear.year;
	const month = monthAndYear.month;

	const handleDateClick = (date: Date) => {
		if (isWeekend(date)) return;
		onDateClick(date);
	};

	const daysInMonth = getDaysInTheMonth(year, month);
	const firstDayOfWeek = daysInMonth[0].getDay();
	const lastDayOfPreviousMonth = new Date(year, month, 0);
	const blanksBeforeMonth = Array.from({ length: firstDayOfWeek }, (_, i) => i);
	const blanksAfterMonth = Array.from({ length: 42 - (daysInMonth.length + blanksBeforeMonth.length) }, (_, i) => i);
	const weekdays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

	const isDateSelected = (date: Date): boolean => {
		if (!selectedStartDate && !selectedEndDate) return false;
		return date.valueOf() === selectedStartDate?.valueOf() || date.valueOf() === selectedEndDate?.valueOf();
	};

	const getDayClasses = (date: Date) => {
		let classname = "day";
		const isThisDateSelected = isDateSelected(date);
		const isThisWeekend = isWeekend(date);
		const isCurrentDay = new Date().toDateString() === date.toDateString();
		if (isThisDateSelected) classname += " selected";
		if (isThisWeekend) classname += " weekend";
		else classname += " weekday";
		if (isCurrentDay) classname += " current-day";
		return classname;
	};

	const isHighlightedDate = (date: Date): boolean => {
		if (isWeekend(date)) return false;
		const endDate = selectedEndDate ? selectedEndDate : tempEndDate;
		if (!selectedStartDate && !endDate) return false;
		if (endDate && selectedStartDate && endDate < selectedStartDate) return date > endDate && date < selectedStartDate;
		return !!(endDate && selectedStartDate && date < endDate && date > selectedStartDate);
	};

	return (
		<div className='calendar'>
			<div className='month-year'>
				<button className='calendar_button year_button' onClick={() => handleYearChange(true)}>
					&lt;&lt;
				</button>
				<button className='calendar_button month_button' onClick={() => handleMonthChange(true)}>
					&lt;
				</button>
				<span>{`${new Date(year, month).toLocaleString("default", {
					month: "short",
				})}, ${year}`}</span>
				<button className='calendar_button month_button' onClick={() => handleMonthChange(false)}>
					&gt;
				</button>
				<button className='calendar_button year_button' onClick={() => handleYearChange(false)}>
					&gt;&gt;
				</button>
			</div>
			<div className='weekdays'>
				{weekdays.map((day, index) => (
					<div key={`day-${index}`} className={day === "Sa" || day === "Su" ? "weekend" : ""}>
						{day}
					</div>
				))}
			</div>
			<div className='days' onMouseMove={(event) => onMouseMoveHandler(monthAndYear.year, monthAndYear.month, event)}>
				{blanksBeforeMonth.map((i, index) => {
					const blankDay = lastDayOfPreviousMonth.getDate() + 1 - blanksBeforeMonth.length + i;
					return (
						<div key={`blank-before-${index}`} className='empty day'>
							{blankDay}
						</div>
					);
				})}
				{daysInMonth.map((day, index) => {
					const isWeekEnd = isWeekend(day);
					return (
						<div key={`day-${index}`} className={getDayClasses(day)} onClick={() => handleDateClick(day)}>
							<span className={`${!isWeekEnd ? "weekday-text" : ""} ${isHighlightedDate(day) ? "highlighted-day" : ""}`}>{day.getDate()}</span>
						</div>
					);
				})}
				{blanksAfterMonth.map((i, index) => (
					<div key={`blank-after-${index}`} className='empty day'>
						{i + 1}
					</div>
				))}
			</div>
		</div>
	);
};

export default Calendar;
