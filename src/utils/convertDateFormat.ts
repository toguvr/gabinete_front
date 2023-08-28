export function convertDateFormat(dateStr: string): string {
	const parts = dateStr.split('/');
	const newDate = new Date(
		parseInt(parts[2]),
		parseInt(parts[1]) - 1,
		parseInt(parts[0]),
		13,
		0,
		0,
	);
	return newDate.toISOString();
}