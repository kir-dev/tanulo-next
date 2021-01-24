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
let defDate = { start: now.addHours(1), end: now.addHours(2) }

if (typeof range !== 'undefined') {
  const parsed = { start: new Date(range.start), end: new Date(range.end) }

  //In case of valid range selection or editing state, we can pass original range
  if ((parsed.start >= now) || (typeof isEditing !== 'undefined' && isEditing))
    defDate = parsed
  else
    displayMessage('Múltbéli időintervallumban csoport nem hozható létre')
}

function refreshPickerInput(picker) {
  picker.datePicker.refresh()
  picker.timePicker.refresh()
  picker.save()
}

function setPickerValue(picker, value) {
  picker.clear()
  picker.value(value)
  refreshPickerInput(picker)
}

setPickerValue(pickerStart, defDate.start)
setPickerValue(pickerEnd, defDate.end)

//Preventing crossing ranges
pickerStart.on('hide', () => {
  const local = { start: new Date(pickerStart.value()), end: new Date(pickerEnd.value()) }
  if (local.start >= local.end)
    setPickerValue(pickerEnd, local.start.addMinutes(5))
})

pickerEnd.on('hide', () => {
  const local = { start: new Date(pickerStart.value()), end: new Date(pickerEnd.value()) }
  if (local.start >= local.end)
    setPickerValue(pickerStart, local.end.addMinutes(-5))
})

//Closing picker when clicking out of it
window.addEventListener('click', e => {
  if (!document.getElementById('pickerStart') != e.target)
    pickerStart.hide()

  if (!document.getElementById('pickerEnd') != e.target)
    pickerEnd.hide()
})
