export interface YearAndMonthType {
	year: number;
	month: number;
}

export function getWeekends(startDate: Date, endDate: Date): Date[] {
	const weekends = [];
	let currentDate = new Date(startDate);
	while (currentDate <= endDate) {
		if (currentDate.getDay() === 0 || currentDate.getDay() === 6) {
			weekends.push(new Date(currentDate));
		}
		currentDate.setDate(currentDate.getDate() + 1);
	}
	return weekends;
}

export const getNextMonthWithYear = (date: YearAndMonthType): YearAndMonthType => {
	let nexMonthYear = date.year;
	let nextMonth = date.month + 1;
	if (nextMonth > 11) {
		nextMonth = 0;
		nexMonthYear++;
	}
	return { year: nexMonthYear, month: nextMonth };
};

export const getPreviousMonthWithYear = (date: YearAndMonthType): YearAndMonthType => {
	let prevMonthYear = date.year;
	let prevMonth = date.month - 1;
	if (prevMonth < 0) {
		prevMonth = 11;
		prevMonthYear--;
	}
	return { year: prevMonthYear, month: prevMonth };
};

export const isOneMonthOrMoreDifference = (firstMonthAndYear: YearAndMonthType, secondMonthAndYear: YearAndMonthType): boolean => {
	let { year: year1, month: month1 } = firstMonthAndYear;
	let { year: year2, month: month2 } = secondMonthAndYear;
	if (year1 > year2) return false;
	return month1 < month2;
};

export const getDaysInTheMonth = (year: number, month: number): Date[] => {
	const lastDayOfMonth = new Date(year, month + 1, 0);
	const daysInMonth: Date[] = [];
	for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
		daysInMonth.push(new Date(year, month, i));
	}
	return daysInMonth;
};

export const isWeekend = (date: Date): boolean => {
	return date.getDay() === 0 || date.getDay() === 6;
};
