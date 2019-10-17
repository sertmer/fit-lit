const chai = require('chai');
const expect = chai.expect;
const SleepRepo = require('../src/sleepRepo');
const sleepDataSample = require('../data/sleep-sample');
const SleepUser = require('../src/sleepUser');

describe('SleepUser', () => {

  let sleepUser;
  let sleepRepo;
  let userSleepData;

  beforeEach(() => {
    sleepRepo = new SleepRepo(sleepDataSample);
    userSleepData = sleepRepo.getUserSleepData(1);
    sleepUser = new SleepUser(userSleepData);
  });

  it('should be a function', () => {
    expect(SleepUser).to.be.a('function');
  });

  it('should be an instance of UserRepo', () => {
    expect(sleepUser).to.be.an.instanceOf(SleepUser);
  });

  it('should contain the sleep data for the specified users', () => {
    expect(sleepUser.sleepData).to.deep.equal(userSleepData);
  });

  it('should calculate the users average hours sleep/day', () => {
    expect(sleepUser.calcAvgSleepPerDay('hoursSlept')).to.equal(7.92);
  });

  it('should calculate the users average sleep quality/day', () => {
    expect(sleepUser.calcAvgSleepPerDay('sleepQuality')).to.equal(2.41);
  });

  it('should calculate how many hours they slept in a day by day', () => {
    expect(sleepUser.getSleepDataDay("2019/06/15", 'hoursSlept')).to.equal(6.1);
  });

  it('should get their quality of sleep from a particular day', () => {
    expect(sleepUser.getSleepDataDay("2019/06/15", 'sleepQuality')).to.equal(2.2);
  });

  it('should get hours slept and sleep quality for a user daily over the course of a week', () => {
    expect(sleepUser.getDailySleepByWeek("2019/06/24")).to.deep.equal([{
      userID: 1,
      date: '2019/06/17',
      hoursSlept: 8,
      sleepQuality: 2.6
    },
    {
      userID: 1,
      date: '2019/06/18',
      hoursSlept: 10.4,
      sleepQuality: 3.1
    },
    {
      userID: 1,
      date: '2019/06/19',
      hoursSlept: 10.7,
      sleepQuality: 1.2
    },
    {
      userID: 1,
      date: '2019/06/20',
      hoursSlept: 9.3,
      sleepQuality: 1.2
    },
    {
      userID: 1,
      date: '2019/06/21',
      hoursSlept: 7.8,
      sleepQuality: 4.2
    },
    { userID: 1, date: '2019/06/22', hoursSlept: 7, sleepQuality: 3 },
    {
      userID: 1,
      date: '2019/06/23',
      hoursSlept: 7.8,
      sleepQuality: 1.5
    },
    {
      userID: 1,
      date: '2019/06/24',
      hoursSlept: 8,
      sleepQuality: 1.3
    }]);
  });

  it('should get average hours slept for a user over the course of any given week', () => {
    expect(sleepUser.getAvgHoursByWeek("2019/06/24", 'hoursSlept')).to.deep.equal(
      { date: '2019/06/17 - 2019/06/24', avghoursSlept: 8.63 });
  });

  it('should get average quality sleep for a user over the course of any given week', () => {
    expect(sleepUser.getAvgHoursByWeek("2019/06/24", 'sleepQuality')).to.deep.equal(
      { date: '2019/06/17 - 2019/06/24', avgsleepQuality: 2.26 });
  });

});
