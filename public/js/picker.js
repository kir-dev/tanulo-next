//Adding hours and minutes are be easier with these prototype methods
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

//Setting up datetimepickers
const options = {
  type: 'datetime',
  color: 'info',
  dateFormat: 'YYYY-MM-DD',
  showClearButton: false,
  enableYearSwitch: false,
  minDate: Date(),
  weekStart: 1,
  closeOnSelect: false,
  showHeader: false,
  cancelLabel: 'Elvetés',
  todayLabel: 'Ma',
  validateLabel: 'Mentés'
}
const pickerStart = new bulmaCalendar(document.getElementById('pickerStart'), options)
const pickerEnd = new bulmaCalendar(document.getElementById('pickerEnd'), options)

//Getting rid of their clearButtons (required)
const clearButtons = document.getElementsByClassName('datetimepicker-clear-button')
Array.from(clearButtons).forEach(button => {
  button.remove()
})

//Main logic for manipulating dates and times
const now = new Date()
now.setMinutes(0, 0, 0)
let startDef = now.addHours(1)
let endDef = now.addHours(2)

if (typeof range !== 'undefined') {
  const parsedStart = new Date(range.start)
  if (parsedStart >= now) {
    startDef = parsedStart
    endDef = new Date(range.end)
  }
  else
    displayMessage('warning', 'Múltbéli időintervallumban csoport nem hozható létre')
}

function setPickerValue(picker, value) {
  picker.clear()
  picker.value(value)
  picker.datePicker.refresh()
  picker.timePicker.refresh()
  picker.save()
}

setPickerValue(pickerStart, startDef)
setPickerValue(pickerEnd, endDef)

//Bypassing illegal time input
pickerStart.on('hide', () => {
  const startLocal = new Date(pickerStart.value())
  const endLocal = new Date(pickerEnd.value())
  if (startLocal >= endLocal) {
    setPickerValue(pickerEnd, startLocal.addMinutes(5))
  }
})

pickerEnd.on('hide', () => {
  const startLocal = new Date(pickerStart.value())
  const endLocal = new Date(pickerEnd.value())
  if (startLocal >= endLocal) {
    setPickerValue(pickerStart, endLocal.addMinutes(-5))
  }
})
