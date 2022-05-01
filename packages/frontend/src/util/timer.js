const convertToMS = (time) => {
  let minutes = Math.floor(time / 60);
  let seconds = time - 60 * Math.floor(time / 60);

  let minStr = minutes.toString();
  let secStr = seconds.toString();

  if (minutes < 10) {
    minStr = "0" + minutes;
  }
  if (seconds < 10) {
    secStr = "0" + seconds;
  }
  return minStr + ":" + secStr;
};

export { convertToMS };
