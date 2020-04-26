//Adding hours and minutes are be easier with these prototype methods:
Date.prototype.addHours = function(h) {
  const temp = new Date()
  temp.setTime(this.getTime() + (h*60*60*1000))
  return temp
}
Date.prototype.addMinutes = function(m) {
  const temp = new Date()
  temp.setTime(this.getTime() + (m*60*1000))
  return temp
}

//Main logic:
const now = new Date()
now.setMinutes(0, 0, 0)

let startDef = now.addHours(1)
let endDef = now.addHours(2)

if (typeof range !== 'undefined') {
  const parsedStart = flatpickr.parseDate(range.start, 'Y-m-dTH:i')
  if (parsedStart >= now) {
    startDef = parsedStart
    endDef = flatpickr.parseDate(range.end, 'Y-m-dTH:i')
  }
  else
    alert('Hiba: múltbéli időintervallumban csoport nem hozható létre.')
}

const pickerStart = flatpickr('#pickerStart', {
  enableTime: true,
  dateFormat: 'Y-m-d H:i',
  minDate: 'today',
  // eslint-disable-next-line @typescript-eslint/camelcase
  time_24hr: true,
  defaultDate: startDef
})

const pickerEnd = flatpickr('#pickerEnd', {
  enableTime: true,
  dateFormat: 'Y-m-d H:i',
  minDate: 'today',
  // eslint-disable-next-line @typescript-eslint/camelcase
  time_24hr: true,
  defaultDate: endDef
})

//Watching out for illegal DateTime ranges between start and end:
pickerStart.config.onChange.push(function() {
  if (pickerStart.selectedDates[0] >= pickerEnd.selectedDates[0]) {
    pickerEnd.setDate(pickerStart.selectedDates[0].addMinutes(5))
  }
})

pickerEnd.config.onChange.push(function() {
  if (pickerStart.selectedDates[0] >= pickerEnd.selectedDates[0]) {
    pickerStart.setDate(pickerEnd.selectedDates[0].addMinutes(-5))
  }
})