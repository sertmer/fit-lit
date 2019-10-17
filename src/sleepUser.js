class SleepUser {
  constructor(userSleepData){
  this.sleepData = userSleepData;
  }

  calcAvgSleepPerDay(property) {
    let totalSleepQuality = this.sleepData.reduce((acc, day) => {
      acc += day[property];
      return acc;
    }, 0);
    let avgSleepQuality = totalSleepQuality / this.sleepData.length;
    return Math.round(avgSleepQuality * 100) / 100;
  }

  getSleepDataDay(date, property) {
    return this.sleepData.reduce((acc, object) => {
      if(object.date === date) {
        acc += object[property];
      }
      return acc;
    }, 0)
  }

  getDailySleepByWeek(date) {
    let dataDate = this.sleepData.map(data => data.date);
    let dateIndex = dataDate.lastIndexOf(date);
    let weekData = this.sleepData.slice(dateIndex - 7, dateIndex + 1);
    return weekData;
  }

  getAvgHoursByWeek(date, property) {
    let dataDate = this.sleepData.map(data => data.date);
    let avgPropertyNames = `avg${property}`;
    let dateIndex = dataDate.lastIndexOf(date);
    let weekData = this.sleepData.slice(dateIndex - 7, dateIndex + 1);
    let avgWeekHoursSlept = weekData.reduce((acc, day) => {
      if(!acc[avgPropertyNames]) {
        acc[avgPropertyNames] = 0;
      }
      acc[avgPropertyNames] += day[property];
      return acc;
    }, {date: `${weekData[0].date} - ${weekData[7].date}`})
    avgWeekHoursSlept[avgPropertyNames] = Math.round((avgWeekHoursSlept[avgPropertyNames] / 8) * 100) / 100;
    return avgWeekHoursSlept;
  }

}


if (typeof module !== 'undefined') {
  module.exports = SleepUser;
}
