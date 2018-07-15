function getTimeLabel(milliseconds) {
  let h = 0;
	let m = Math.trunc(milliseconds / 1000 / 60);
	let s = Math.trunc(milliseconds / 1000 % 60);

	if (m >= 60) {
		h = Math.trunc(m / 60);
		m = Math.trunc(m % 60);
	}

	h = h < 0 ? '' : (h < 10) ? '0' + h : h;
	m = (m < 10) ? '0' + m : m;
	s = (s < 10) ? '0' + s : s;

	let label = m + ':' + s;
	if (h > 0) {
		label = h + ':' + label;
  }
  return label;
}