//Adding hours and minutes are be easier with these prototype methods
Date.prototype.addHours = function(h) {
  const temp = new Date()
  temp.setTime(this.getTime() + (h * 60 * 60 * 1000))
  return temp
}
Date.prototype.addMinutes = function(m) {
  const temp = new Date()
  temp.setTime(this.getTime() + (m * 60 * 1000))
  return temp
}

//Main logic for manipulating dates and times
const now = new Date()
now.setMinutes(0, 0, 0)
let startDef = now.addHours(1)
let endDef = now.addHours(2)

if (typeof range !== 'undefined') {
  const parsedStart = flatpickr.parseDate(range.start, 'Y-m-dTH:i')
  if (parsedStart >= now) {
    startDef = parsedStart
    endDef = flatpickr.parseDate(range.end, 'Y-m-dTH:i')
  } else {
    displayMessage('Hiba: múltbéli időintervallumban csoport nem hozható létre.')
  }
}

const options = {
  enableTime: true,
  dateFormat: 'Y-m-d H:i',
  minDate: 'today',
  /* eslint-disable-next-line @typescript-eslint/naming-convention */
  time_24hr: true,
  disableMobile: 'true',
}

const pickerStart = flatpickr('#pickerStart', {
  ...options,
  defaultDate: startDef,
})

const pickerEnd = flatpickr('#pickerEnd', {
  ...options,
  defaultDate: endDef,
})

//Watching out for illegal DateTime ranges between start and end:
pickerStart.config.onChange.push(function () {
  if (pickerStart.selectedDates[0] >= pickerEnd.selectedDates[0]) {
    pickerEnd.setDate(pickerStart.selectedDates[0].addMinutes(5))
  }
})

pickerEnd.config.onChange.push(function () {
  if (pickerStart.selectedDates[0] >= pickerEnd.selectedDates[0]) {
    pickerStart.setDate(pickerEnd.selectedDates[0].addMinutes(-5))
  }
})
