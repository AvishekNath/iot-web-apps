import moment from 'moment';

export const createDataPoint = (time = Date.now(), magnitude = 1000, offset = 0) => {

  //const timeStamp = time + offset * magnitude;

  time = getCurrentTimeUTC();
  
  return [
    time,
    Math.round((Math.random() * 100) * 2) / 2
  ];
};

export const createRandomData = (time, magnitude, points = 1) => {
  const data = [];
  let i = (points * -1) + 1;
  for (i; i <= 0; i++) {
    data.push(createDataPoint(time, magnitude, i));
  }
  return data;
};

export const addDataPoint = (data, toAdd) => {
  if (!toAdd) toAdd = createDataPoint(data);
  console.log(toAdd);
  const newData = data.slice(0); // Clone
  newData.push(toAdd);
  return newData;
};


export const addSensorData = (data, toAdd) => {
  const newData = data.slice(0); // Clone
  newData.push(toAdd);
  return newData;
};


export const getCurrentTimeUTC = (timeStamp) => {
    //RETURN:
    //      = number of milliseconds between current UTC time and midnight of January 1, 1970
    //var tmLoc = Date.now();
    //The offset is in minutes -- convert it to ms
    //return tmLoc.getTime() + tmLoc.getTimezoneOffset() * 60000;
    //return moment.utc(tmLoc).valueOf()

    let year = new Date(timeStamp).getFullYear();
    let month = new Date(timeStamp).getMonth();
    let date = new Date(timeStamp).getDate();
    let hours = new Date(timeStamp).getHours();
    let mins = new Date(timeStamp).getMinutes();
    let seconds = new Date(timeStamp).getSeconds();
    return Date.UTC(year, month, date, hours, mins, seconds);
};


export const marshallLineChartData = (series) => {
  series = series.sort(function(a,b){
    // Turn your strings into dates, and then subtract them
    // to get a value that is either negative, positive, or zero.
    return new Date(b.ts * 1000) - new Date(a.ts * 1000);
  });
  const newData = series.map(data => {
    return [
      getCurrentTimeUTC(data.ts * 1000),
      Number(data.value.toFixed(2))
    ];
  });

  return newData;
};
