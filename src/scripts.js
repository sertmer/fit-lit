$(document).ready(function() {
let user;
let userRepo;
let hydroUser;
let hydroRepo;
let sleepRepo;
let sleepUser;
let activityRepo;
let activityUser;
let userFriends;
let date;

$("body").delegate("#datepicker", "focusin", function () {
  $(this).datepicker({
      dateFormat: "yy/mm/dd",
      minDate: new Date(2019, 05, 15),
      maxDate: new Date(2019, 08, 22),
    });
});

$("body").on("click", "#login-page-button", clickLoginButton);
$("body").on("click", "#user-logout-button", logout);
$("body").on("click", "#aside-step-challenge", addFriendsTotalStepsByWeek);
$("body").on("click", "#aside-step-challenge, #challenge-delete-button-step", function() {
  $("#step-challenge-background").toggleClass("hidden");
});
$("body").on("click", "#aside-step-trend", addStepTrend);
$("body").on("click", "#aside-step-trend, #challenge-delete-button-trend", function() {
  $("#step-trend-background").toggleClass("hidden");
});
$("body").on("click", "#aside-drink-challenge", addFriendsTotalDrankByWeek);
$("body").on("click", "#aside-drink-challenge, #challenge-delete-button-drink", function() {
  $("#drink-challenge-background").toggleClass("hidden");
});

function clickLoginButton(event) {
  if (!$("#login-page-input").val() || !$("#datepicker").val()) {
    displayErrorMessage();
    displayNoDateMessage();
    event.preventDefault();
  } else {
    getDate()
    instantiateUserData(userData);
    instantiateHydroData(hydrationData);
    instantiateSleepData(sleepData);
    instantiateActivityData(activityData);
    instantiateFriendsUser();
    displayUserPage();
    addUserFirstName();
    addUserInfo(user);
    addUserFriendsName();
    addStepComparison(user, userRepo);
    addOzToday();
    addWeeklyOzByDay();
    addSleepDataforDay();
    addWeeklySleepDataByDay();
    addAllTimeSleepAvg();
    addAllUsersActivityAverages();
    addFlightsOfStairsForLatestDay();
    addMilesForLatestDay();
    addMinutesActiveByDay();
    addNumStepsForLatestDay();
    addWeeklyActivityDataByDay();
    addAllTimeMinsActiveRecord();
  }
}

function instantiateUserData(usersData) {
  userRepo = new UserRepo(usersData);
  let userInfo = userRepo.getUserData($("#login-page-input").val())
  user = new User(userInfo);
}

function instantiateHydroData(data) {
  hydroRepo = new HydroRepo(data);
  let hydroUserInfo = hydroRepo.getUserHydroData(user.id);
  hydroUser = new HydroUser(hydroUserInfo);
}

function instantiateSleepData(data) {
  sleepRepo = new SleepRepo(data);
  let userSleepData = sleepRepo.getUserSleepData(user.id);
  sleepUser = new SleepUser(userSleepData);
}

function instantiateActivityData(data) {
  activityRepo = new ActivityRepo(data);
  let userActivityData = activityRepo.getUserActivityData(user.id);
  activityUser = new ActivityUser(userActivityData);
}

function instantiateFriendsUser() {
  let friendsInfo = getFriendsInfo(user);
  let instantiatedFriends = friendsInfo.map((friendInfo) => {
    let friend = new User(friendInfo);
    return friend;
  });
  userFriends = instantiatedFriends;
  user.friends = userFriends;
  return instantiatedFriends;
}

function getFriendsInfo(user) {
  let friendInfo = user.friends.map(friend => {
    let friendInfo = userRepo.getFriendData(friend);
    return friendInfo;
  });
  return friendInfo;
}

function instantiateFriendsActivity() {
  return user.friends.map((friendInfo) => {
    let friendActivityInfo = activityRepo.getUserActivityData(friendInfo.id);
    let friendActivity = new ActivityUser(friendActivityInfo);
    return friendActivity;
  });
}

function instantiateFriendsHydro() {
  return user.friends.map((friendInfo) => {
    let friendHydroInfo = hydroRepo.getUserHydroData(friendInfo.id);
    let friendHydro = new HydroUser(friendHydroInfo);
    return friendHydro;
  });
}

function getDate() {
  date = $("#datepicker").val();
}

function closePopUp() {
  $("#")
}

function logout() {
  $("#body-content-containe").remove();
  $("body").html(`
    <main class="main-login-page" id="main-login-page">
      <img class="login-background" alt="Blurred screenshot of the application" src="../images/login-background-screenshot.png">
      <div class="login-form-and-header-container">
        <h1 class="login-page-header">Ready to get FitLit?!</h1>
        <form class="login-page-form" id="login-page-form">
          <p class="login-paragraph">Login: <input type="text" placeholder="Enter email here:" class="login-page-input" id="login-page-input"></p>
          <p class="login-paragraph">Date: <input class="login-page-input" type="text" id="datepicker" placeholder="Choose a date:"></p>
          <input type="button" value="Log In" class="login-page-button" id="login-page-button">
        </form>
      </div>
    </main>
  `);
}

function addFriendsTotalDrankByWeek() {
  if ($("#friend-weekly-drink-section").length === 0) {
    let everyone = userFriends.concat(user);
    let friendsHydro = instantiateFriendsHydro();
    let allHydro = friendsHydro.concat(hydroUser);
    $("#aside-drink-challenge").after(`
      <div class="step-challenge-background hidden" id="drink-challenge-background">
        <section class="section-style step-challenge-section" id="friend-weekly-drink-section">
        <button class="delete-button" id="challenge-delete-button-drink">close</button>
          <div class="users-total-steps-div" id="users-total-drinks-div">
          </div>
        </section
      </div>`);
    let friendsTotalDrinks = allHydro.map((friend, index) => {
      let totalfriendDrinksByWeek = friend.calcTotalDrankByWeek(date);
      let friendFirstName = everyone[index].getFirstName();
      $("#users-total-drinks-div").append(`
            <div class="drank-challenge-div">
              <h3>${friendFirstName}</h3>
              <p>${totalfriendDrinksByWeek} oz</p>
            </div>`);
      return {
        totalDrinks: totalfriendDrinksByWeek,
        name: friendFirstName
        };
      });
      let weekPrior = getWeekPriorDate();
      friendsTotalDrinks.sort((a, b) => b.totalDrinks - a.totalDrinks);
      $("#challenge-delete-button-drink").after(`
            <div>
              <h3>Which Friend drank the most this week?!</h3>
              <h3>${weekPrior} - ${date}</h3>
              <h3>${friendsTotalDrinks[0].name} is the most hydrated!!</h3>
            </div>`);
  }
}

function addFriendsTotalStepsByWeek() {
  if ($("#friend-weekly-steps-section").length === 0) {
    let everyone = userFriends.concat(user);
    let friendsActivity = instantiateFriendsActivity();
    let allActivity = friendsActivity.concat(activityUser);
    $("#aside-step-challenge").after(`
      <div class="step-challenge-background hidden" id="step-challenge-background">
        <section class="section-style step-challenge-section" id="friend-weekly-steps-section">
          <button class="delete-button" id="challenge-delete-button-step">close</button>
          <div class="users-total-steps-div" id="users-total-steps-div">
          </div>
        </section
      </div>`);
    let friendsTotalSteps = allActivity.map((friend, index) => {
      let totalfriendStepsByWeek = friend.calcTotalStepsByWeek(date);
      let friendFirstName = everyone[index].getFirstName();
      $("#users-total-steps-div").append(`
            <div class="drank-challenge-div">
              <h3>${friendFirstName}</h3>
              <p>${totalfriendStepsByWeek} steps</p>
            </div>`);
      return {
        totalSteps: totalfriendStepsByWeek,
        name: friendFirstName
        };
      });
      let weekPrior = getWeekPriorDate();
      friendsTotalSteps.sort((a, b) => b.totalSteps - a.totalSteps);
      $("#challenge-delete-button-step").after(`
            <div>
              <h3>Which Friend walked the most this week?!</h3>
              <h3>${weekPrior} - ${date}</h3>
              <h3>${friendsTotalSteps[0].name} is the MOST FitLit!!</h3>
            </div>`);
  }
}

function getWeekPriorDate() {
  let newDay = date.split('/');
  if(newDay[2] < 7) {
    newDay[1] = newDay[1] - 1;
    newDay[2] = (newDay[2] - 7) + 30;
    return newDay.join('/');
  } else {
  newDay = newDay[2] - 7;
  let weekBefore = date.split('/')
  weekBefore.pop()
  weekBefore.splice(2, 0, newDay)
  let week = weekBefore.join('/')
  return week;
  }
}

function addStepTrend() {
  if ($("#step-trend-section").length === 0) {
    let userStepTrend = activityUser.getStepIncreaseTrend();
    $("#aside-step-trend").after(`
      <div class="step-challenge-background hidden" id="step-trend-background">
        <section class="section-style step-trend-section" id="step-trend-section">
        <button class="delete-button" id="challenge-delete-button-trend">close</button>
          <h3>Trending Up On Steps Taken In A Day</h3>
          <div class="step-trend-container" id="step-trend-div"></div>
        </section
      </div>`);
    let num = 0;
    userStepTrend.forEach((trend, index) => {
      if(index === 0 || trend.numSteps < userStepTrend[index - 1].numSteps) {
        num = 0;
        $("#step-trend-div").append(`
        <div class="step-trend-div" id="${index}">
          <h3>TRENDING</h3>
          <h5>${trend.date}</h5>
          <p>Steps: ${trend.numSteps}</p>
        </div>`);
        num += 1
      } else {
        $(`#${index - num}`).append(`
        <h5>${trend.date}</h5>
        <p>Steps: ${trend.numSteps}</p>`);
        num += 1;
      }
    })
  }
}

function displayErrorMessage() {
  if ($("#error-message").length === 0 && !$("#login-page-input").val()) {
    $("#login-page-input").after("<p id='error-message' class='error-message'>Please enter your email</p>");
  } else if ($("#error-message").length > 0 && $("#login-page-input").val()) {
    $("#error-message").remove();
  }
}

function displayNoDateMessage() {
  if ($("#no-date-error-message").length === 0 && !$("#datepicker").val()) {
    $("#datepicker").after("<p id='no-date-error-message' class='error-message'>Please select a date</p>");
  } else if($("#no-date-error-message").length > 0 && $("#datepicker").val()) {
    $("#no-date-error-message").remove();
  }
}

function addUserFirstName() {
  $('#aside-user-name').html(`${user.getFirstName()}`);
}

function addStepComparison(user, userRepo) {
  $("#aside-user-step-comparison").html(`
    <h3 class="aside-step-goal-header">Your Step Goal</h3>
    <div class="aside-step-goal-style user-step-goal">${user.dailyStepGoal}</div>
    <h3 class="aside-step-goal-header">Average Step Goal</h3>
    <div class="aside-step-goal-style">${userRepo.calcAvgStepGoal()}</div>`);
}

function addUserFriendsName() {
  $("#user-logout-button").before(`
    <div class="aside-user-info-div">
      <h4 id="aside-user-friends-div">friends</h4>
    </div>`);
  user.friends.forEach(friend => {
    $("#aside-user-friends-div").after(`
        <p class="aside-user-info-par">${friend.name}</p>`);
  });
}

function addUserInfo(user) {
  let userProperties = Object.keys(user);
  userProperties.splice(0, 4);
  userProperties.pop();
  let orderedUserProperties = userProperties.reverse();
  orderedUserProperties.forEach(function(property, index) {
    $("#aside-user-info-header").after(`
      <div class="aside-user-info-div">
        <h4>${property}</h4>
        <p class="aside-user-info-par">${user[property]}</p>
      </div>`);
  });
}

function addOzToday() {
  $("#card-daily-oz-div").html(`
  <section class="card-daily-oz-paragraph section-style">
    <h3>Ounces Consumed Today</h3>
    <p>${hydroUser.getOzByDate(date)}</p>
  </section>`);
}

function addWeeklyOzByDay() {
 let weeklyUserOz =  hydroUser.getDailyOzPerWeek(date);
  weeklyUserOz.forEach(day => {
    $("#card-weekly-oz-div").append(`
    <section class="section-style">
      <h3>${day.date}</h3>
      <p>${day.numOunces}</p>
    </section>`);
  })
}

function addSleepDataforDay() {
  let hoursSleptOnDay = sleepUser.getSleepDataDay(date, 'hoursSlept');
  let sleepQualityOnDay = sleepUser.getSleepDataDay(date, 'sleepQuality');
  $("#card-daily-sleep-div").append(`
    <section class="section-style">
      <h3>Hours Slept Last Night</h3>
      <p>${hoursSleptOnDay}</p>
    </section>
    <section class="section-style">
      <h3>Sleep Quality Last Night</h3>
      <p>${sleepQualityOnDay}</p>
    </section>`)
}

function addWeeklySleepDataByDay() {
  let weeklyUserSleepHours = sleepUser.getDailySleepByWeek(date);
  weeklyUserSleepHours.forEach(day => {
    $("#card-weekly-sleep-div").append(`
      <section class="section-style">
        <h3>${day.date}</h3>
        <section class="sleep-weekly-data-section">
          <div>Hours Slept: ${day.hoursSlept}</div>
          <div>Quality of Sleep: ${day.sleepQuality}</div>
        </section>
      </section>`)
    })
}

function addAllTimeSleepAvg() {
  let allTimeAvgHoursSlept = sleepUser.calcAvgSleepPerDay('hoursSlept');
  let allTimeAvgSleepQuality = sleepUser.calcAvgSleepPerDay('sleepQuality');
  let avgHoursSleptByWeek = sleepUser.getAvgHoursByWeek(date, 'hoursSlept');
  let avgSleepQualityByWeek = sleepUser.getAvgHoursByWeek(date, 'sleepQuality');
  $("#card-alltime-sleep-div").append(`
    <section class="section-style">
      <h3>Total Average Hours Slept/Night</h3>
      <p>${allTimeAvgHoursSlept}</p>
    </section>
    <section class="section-style">
      <h3>Average Hours Slept/Week</h3>
      <h5>${avgHoursSleptByWeek.date}</h5>
      <p>${avgHoursSleptByWeek.avghoursSlept}</p>
    </section>
    <section class="section-style">
      <h3>Total Average Sleep Quality/Night</h3>
      <p>${allTimeAvgSleepQuality}</p>
    </section>
    <section class="section-style">
      <h3>Average Sleep Quality/Week</h3>
      <h5>${avgSleepQualityByWeek.date}</h5>
      <p>${avgSleepQualityByWeek.avgsleepQuality}</p>
    </section>`);
}

function addMilesForLatestDay() {
  let todaysMiles = activityUser.calcMilesByDay(date, user.strideLength);
  $("#card-daily-activity-div").append(`
  <section class="section-style">
  <h3>Miles Walked</h3>
  <p>${todaysMiles}</p>
  </section>`)
}

function addMinutesActiveByDay() {
  let todaysMinutes = activityUser.getMinutesActiveByDay(date);
  $("#card-daily-activity-div").append(`
  <section class="section-style">
  <h3>Minutes Active</h3>
  <p>${todaysMinutes}</p>
  </section>`)
}

function addNumStepsForLatestDay() {
  let todaysSteps = activityUser.getNumStepsByDay(date);
  $("#card-daily-activity-div").append(`
  <section class="section-style">
  <h3>Today's Steps</h3>
  <p>${todaysSteps}</p>
  </section>`)
}

function addFlightsOfStairsForLatestDay() {
  let todaysFlights = activityUser.getFlightsClimbedByDay(date);
  $("#card-daily-activity-div").append(`
  <section class="section-style">
  <h3>Today's Flights Climbed</h3>
  <p>${todaysFlights}</p>
  </section>`)
}

function addAllUsersActivityAverages() {
  let avgFlights = activityRepo.calcAvgStairsClimbedByDay(date);
  let avgSteps = activityRepo.calcAvgStepsTakenByDay(date);
  let avgMins = activityRepo.calcMinsActiveByDay(date);
  $("#card-daily-activity-div").append(`
  <section class="section-style">
    <h3>Average User Activity</h3>
    <section class="activity-all-users-data-section">
      <div>Steps: ${avgSteps}</div>
      <div>Minutes: ${avgMins}</div>
      <div>Flights: ${avgFlights}</div>
    </section>
  </section>`)
}

function addWeeklyActivityDataByDay() {
  let weeklyUserActivityHours = activityUser.getDailyActivityByWeek(date);
  weeklyUserActivityHours.forEach(day => {
    $("#card-weekly-activity-div").append(`
      <section class="section-style">
        <h3>${day.date}</h3>
        <section class="sleep-weekly-data-section">
          <div>Steps: ${day.numSteps}</div>
          <div>Minutes: ${day.minutesActive}</div>
          <div>Flights: ${day.flightsOfStairs}</div>
        </section>
      </section>`)
    })
}

function addAllTimeMinsActiveRecord() {
  let minsActiveRecord = activityUser.getMinutesActiveRecord();
  $("#card-metric-activity-div").append(`
  <section class="section-style">
    <h3>Personal Best</h3>
    <p>${minsActiveRecord} Minutes Active</p>
  </section>`)
}

function displayUserPage() {
    $("#main-login-page").remove();
    $("body").html(`
  <div class="body-content-container" id="body-content-container">
    <header>
      <section class="header-section-categories">
        <h1 class="header-style header-hydration-style">Hydration</h1>
        <h1 class="header-style header-activity-style">Activity</h1>
        <h1 class="header-style header-sleep-style">Sleep</h1>
      </section>
    </header>
    <aside>
      <div class="aside-user-name">
      <h3 class="user-name" id="aside-user-name"></h3>
      </div>
      <div class="aside-user-info-container">
        <section class="aside-style">
          <h3 class="aside-user-info-header" id="aside-user-info-header">User Info</h3>
          <button class="user-logout-button" id="user-logout-button">Log Out</button>
        </section>
        <section class="aside-style" id="aside-user-step-comparison">
        </section>
        <section class="aside-style">
          <button class="aside-trend-button" id="aside-step-challenge">Step Challenge</button>
          <button class="aside-trend-button" id="aside-drink-challenge">Drink Challenge</button>
          <button class="aside-trend-button" id="aside-step-trend">Step Trend</button>
        </section>
      </div>
    </aside>
    <main class="main-user-stats">
      <div class="main-user-stats-div">
        <article class="card-style card-daily card-daily-oz">
          <h2 id="card-daily-oz-header">Today's Hydration</h2>
          <div class="scroll-div" id="card-daily-oz-div"></div>
        </article>
        <article class="card-style card-weekly card-weekly-oz">
          <h2 id="card-weekly-oz-header">Weekly Water Intake</h2>
          <div class="scroll-div" id="card-weekly-oz-div"></div>
        </article>
        <article class="card-style card-daily card-daily-activity">
          <h2 id="daily-activity-header">Today's Activity</h2>
          <div class="scroll-div" id="card-daily-activity-div"></div>
        </article>
        <article class="card-style card-weekly card-weekly-activity">
          <h2 id="weekly-activity-header">This Week's Activity</h2>
          <div class="scroll-div" id="card-weekly-activity-div"></div>
        </article>
        <article class="card-style card-metric card-metric-activity">
          <h2 id="metric-activity-header">All Time Activity Record</h2>
          <div class="scroll-div" id="card-metric-activity-div"></div>
        </article>
        <article class="card-style card-daily card-daily-sleep">
          <h2 id="card-sleep-daily-data">Previous Night's Sleep Stats</h2>
          <div class="scroll-div" id="card-daily-sleep-div"></div>
        </article>
        <article class="card-style card-weekly card-weekly-sleep">
          <h2 id="card-weekly-sleep-header">Seven Days of Sleep</h2>
          <div class="scroll-div" id="card-weekly-sleep-div"></div>
        </article>
        <article class="card-style card-metric card-all-time-sleep">
          <h2 id="card-sleep-all-time-avg">All Time Sleep Stats</h2>
          <div class="scroll-div" id="card-alltime-sleep-div"></div>
        </article>
      </div>
    </main>
  </div>`)
}

});
