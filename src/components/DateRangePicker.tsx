import React, { useState, useRef, useEffect } from "react";
import Calendar from "./Calendar";
import "../styles/DateRangePicker.css";
import { getNextMonthWithYear, getPreviousMonthWithYear, getWeekends, isOneMonthOrMoreDifference } from "../utils/helper";

interface DateRangePickerProps {
	onDateRangeSelect: (startAndEndDates: [Date, Date], weekends: Date[]) => void;
	predefinedRanges?: [number, number, number, number];
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({ onDateRangeSelect, predefinedRanges = [0, -7, -30, 30] }) => {
	const [startDate, setStartDate] = useState<Date | null>(null);
	const [endDate, setEndDate] = useState<Date | null>(null);
	const [currentMonthAndYear, setCurrentMonthAndYear] = useState({ year: new Date().getFullYear(), month: new Date().getMonth() });
	const [nextMonthAndYear, setNextMonthAndYear] = useState(getNextMonthWithYear(currentMonthAndYear));
	const [tempEndDate, setTempEndDate] = useState<Date | null>(null);
	const [okPressed, setOkPressed] = useState(false);
	const dateRangePickerRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	const handleDateChange = (date: Date) => {
		// when no date is selected
		setOkPressed(false);
		if (!startDate) {
			setStartDate(date);
			return;
		}
		//when both dates are selected
		if (!!endDate) {
			setStartDate(date);
			setEndDate(null);
			return;
		}
		//when the endDate is lesser than startDate
		if (date < startDate) {
			setEndDate(startDate);
			setStartDate(date);
			return;
		}

		setEndDate(date);
		setTempEndDate(null);
	};

	const getPredefinedRangeText = (range: number): string => {
		if (range === 0) return "Today";
		if (range === -1) return "Yesterday";
		if (range === 1) return "Tomorrow";
		if (range > 1) return `Next ${Math.abs(range)} days`;
		return `Last ${Math.abs(range)} days`;
	};

	const closeDateRangePicker = () => {
		dateRangePickerRef.current && (dateRangePickerRef.current.style.display = "none");
	};

	const showDateRangeSelector = () => {
		if (dateRangePickerRef.current) dateRangePickerRef.current.style.display = "flex";
	};

	const setRange = () => {
		if (!startDate || !endDate) return;
		const weekends = getWeekends(startDate, endDate);
		onDateRangeSelect([startDate, endDate], weekends);
		setOkPressed(true);
		closeDateRangePicker();
	};

	const onPredefinedRangeClick = (offset: number) => {
		let startDate = new Date();
		let tempEndDate = new Date();
		if (offset === -1 || offset === 1) startDate.setDate(startDate.getDate() + offset);
		tempEndDate.setDate(tempEndDate.getDate() + offset);
		if (startDate > tempEndDate) [startDate, tempEndDate] = [tempEndDate, startDate];
		const weekends = getWeekends(startDate, tempEndDate);
		setStartDate(startDate);
		setEndDate(tempEndDate);
		setTempEndDate(null);
		setOkPressed(true);
		onDateRangeSelect([startDate, tempEndDate], weekends);
		closeDateRangePicker();
	};

	const handleClickOutside = (event: MouseEvent) => {
		if (event.target && dateRangePickerRef.current && !dateRangePickerRef.current.contains(event.target as HTMLDivElement) && !inputRef.current?.contains(event.target as HTMLDivElement)) {
			dateRangePickerRef.current.style.display = "none";
		}
	};

	const handleMouseMove = (year: number, month: number, event: React.MouseEvent) => {
		if (!startDate) return;
		if (!(event.target instanceof Element)) return;
		const targetClassList = event.target.classList;
		const isTargetWeekDay = targetClassList.contains("weekday") || targetClassList.contains("weekday-text");
		if (!isTargetWeekDay) return;
		const day = event.target.textContent;
		setTempEndDate(new Date(year, month, Number(day)));
	};

	const handleFirstCalendarMonthChange = (isPrevious: boolean) => {
		const newCurrentMonthAndYear = isPrevious ? getPreviousMonthWithYear(currentMonthAndYear) : getNextMonthWithYear(currentMonthAndYear);
		setCurrentMonthAndYear(newCurrentMonthAndYear);
		if (!isPrevious) {
			const isOneMonthDifference = isOneMonthOrMoreDifference(newCurrentMonthAndYear, nextMonthAndYear);
			if (!isOneMonthDifference) setNextMonthAndYear(getNextMonthWithYear(newCurrentMonthAndYear));
		}
	};

	const handleSecondCalendarMonthChange = (isPrevious: boolean) => {
		const newNextMonthAndYear = isPrevious ? getPreviousMonthWithYear(nextMonthAndYear) : getNextMonthWithYear(nextMonthAndYear);
		setNextMonthAndYear(newNextMonthAndYear);
		if (isPrevious) {
			const isOneMonthDifference = isOneMonthOrMoreDifference(currentMonthAndYear, newNextMonthAndYear);
			if (!isOneMonthDifference) setCurrentMonthAndYear(getPreviousMonthWithYear(newNextMonthAndYear));
		}
	};

	const handleFirstCalendarYearChange = (isPrevious: boolean) => {
		const newCurrentMonthAndYear = { year: isPrevious ? currentMonthAndYear.year - 1 : currentMonthAndYear.year + 1, month: currentMonthAndYear.month };
		setCurrentMonthAndYear(newCurrentMonthAndYear);
		if (!isPrevious) {
			const isOneMonthDifference = isOneMonthOrMoreDifference(newCurrentMonthAndYear, nextMonthAndYear);
			if (!isOneMonthDifference) setNextMonthAndYear(getNextMonthWithYear(newCurrentMonthAndYear));
		}
	};

	const handleSecondCalendarYearChange = (isPrevious: boolean) => {
		const newNextMonthAndYear = { year: isPrevious ? nextMonthAndYear.year - 1 : nextMonthAndYear.year + 1, month: nextMonthAndYear.month };
		setNextMonthAndYear(newNextMonthAndYear);
		if (isPrevious) {
			const isOneMonthDifference = isOneMonthOrMoreDifference(currentMonthAndYear, newNextMonthAndYear);
			if (!isOneMonthDifference) setCurrentMonthAndYear(getPreviousMonthWithYear(newNextMonthAndYear));
		}
	};

	const getInputValue = () => {
		if (okPressed && startDate && endDate) return `${startDate.toLocaleDateString("en-GB")} - ${endDate.toLocaleDateString("en-GB")}`;
		return `Select Date Range`;
	};

	const removeSelectedDate = () => {
		setStartDate(null);
		setEndDate(null);
		setTempEndDate(null);
		setOkPressed(false);
	};

	useEffect(() => {
		document.addEventListener("click", handleClickOutside);
		return () => {
			document.removeEventListener("click", handleClickOutside);
		};
	}, []);

	return (
		<>
			<div className='input-container'>
				<input ref={inputRef} id='input' onFocus={showDateRangeSelector} className='input' onClick={showDateRangeSelector} value={getInputValue()} />
				{!okPressed && <label htmlFor={"input"}>&#128467;</label>}
				{okPressed && (
					<label onClick={removeSelectedDate} className='close'>
						&#x00d7;
					</label>
				)}
			</div>
			<div ref={dateRangePickerRef} className='date-range-picker'>
				<div className='date-format'>
					{startDate ? `${startDate.toLocaleDateString("en-GB")}` : "dd/mm/yyyy"} - {endDate ? `${endDate.toLocaleDateString("en-GB")}` : "dd/mm/yyyy"}
				</div>
				<div style={{ display: "flex" }}>
					<div className='left-calendar'>
						<Calendar
							handleMonthChange={handleFirstCalendarMonthChange}
							handleYearChange={handleFirstCalendarYearChange}
							monthAndYear={currentMonthAndYear}
							onDateClick={handleDateChange}
							selectedStartDate={startDate}
							selectedEndDate={endDate}
							onMouseMoveHandler={handleMouseMove}
							tempEndDate={tempEndDate}
						/>
					</div>
					<div className='right-calendar'>
						<Calendar
							handleMonthChange={handleSecondCalendarMonthChange}
							handleYearChange={handleSecondCalendarYearChange}
							monthAndYear={nextMonthAndYear}
							onDateClick={handleDateChange}
							selectedStartDate={startDate}
							selectedEndDate={endDate}
							onMouseMoveHandler={handleMouseMove}
							tempEndDate={tempEndDate}
						/>
					</div>
				</div>
				<div className='predefined-ranges-container'>
					<div className='predefined-ranges'>
						{predefinedRanges.map((range) => (
							<button key={range} className='predefined-ranges-button' onClick={() => onPredefinedRangeClick(range)}>
								{getPredefinedRangeText(range)}
							</button>
						))}
					</div>
					<button className={`ok-button ${!!!endDate || !!!startDate ? "ok-button-disabled" : ""}`} onClick={setRange}>
						OK
					</button>
				</div>
			</div>
		</>
	);
};

export default DateRangePicker;
