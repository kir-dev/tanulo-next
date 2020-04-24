//source: https://bossanova.uk/jsuites/javascript-calendar

const pickerStart = jSuites.calendar(document.getElementById('pickerStart'), {
  time: true,
  format: 'YYYY-MM-DD HH24:MI',
  resetButton: false,
  startingDay: 1,
  onclose: function() {
    pickerStart.setValue(pickerStart.getValue())
  }
})

const pickerEnd = jSuites.calendar(document.getElementById('pickerEnd'), {
  time: true,
  format: 'YYYY-MM-DD HH24:MI',
  resetButton: false,
  startingDay: 1,
  onclose: function() {
    pickerEnd.setValue(pickerEnd.getValue())
  }
})