var setUserHtml = function() {
    $('aside').prepend("<a href='" + userData.html_url + "'><img class='avatar' src='" + userData.avatar_url + "' alt='' /></a>");
    $('.name-box').find('h1').text(userData.name);
    $('.name-box').find('h2').text(userData.login);
    $('aside').find('.location').text(userData.location);
    $('aside').find('.date-joined').text("Joined on " + moment(userData.created_at).format('MMM D, YYYY'));
    var userStatHtml = "<a href='" + userData.followers_url + "'class='stat'>"
                      + "<div class='stat-num followers'>" + userData.followers + "</div>"
                      + "<div class='stat-name'>Followers</div>"
                    + "</a>"
                    + "<a href='" + userData.starred_url + "'class='stat'>"
                      + "<div class='stat-num followers'>" + "0" + "</div>"
                      + "<div class='stat-name'>Followers</div>"
                    + "</a>"
                    + "<a href='" + userData.following_url + "'class='stat'>"
                      + "<div class='stat-num followers'>" + userData.following + "</div>"
                      + "<div class='stat-name'>Followers</div>"
                    + "</a>"
    $('.stat-box').html(userStatHtml);
}

var sortReposByUpdate = function(rawRepos) {
  return _.sortBy(rawRepos, 'updated_at').reverse();
}

var setRepoHtml = function(repoData) {
  var repoHtml = "";
  repoData.forEach(function(repo) {
    repoHtml += "<div class='repo-list'>"
                + "<div class='repo-stats'>"
                  + "<span class='repo-lang'>"
                    + repo.language
                  + "</span>"
                  + "<a href='" + repo.stargazers_url + "' class='repo-stat-item'><span class='octicon octicon-star'></span>" + repo.stargazers_count + "</a>"
                  + "<a href='" + repo.forks_url + "' class='repo-stat-item'><span class='octicon octicon-git-branch'></span>" + repo.forks_count + "</a>"
                + "</div>"
                + "<a href='" + repo.html_url + "'><h3 class='repo-list-name'>" + repo.name + "</h3></a>"
                + "<p class='repo-desc'>" + repo.description + "</p>"
                + "<p class='repo-last-up'>Updated " + moment(repo.updated_at, "YYYYMMDDH").fromNow() + "</p>"
              + "</div>";
  });
  $('.repo-box').html(repoHtml);
};

var setActivityHtml = function(activityData) {
  var activityHtml = "";
  activityData.forEach(function(activityList) {
    if (activityList.type === "CreateEvent") {
      activityHtml += "<div class='activity-list border-top'>";
      activityHtml += "<div class='activity-text'>";
      activityHtml += "<a href='" + userData.html_url + "'><span class='username'>" + activityList.actor.login + "</span></a> created ";
      if (activityList.payload.ref_type === "branch") {
        activityHtml += "branch <a href='#'><span class='branch-name'>" + activityList.payload.ref +  "</span></a> at <a href='" + activityList.repo.url + "'><span class='file-path'>" + activityList.repo.name + "</span></a> <span class='time-ago'>" + moment(activityList.created_at, "YYYYMMDDH").fromNow() + "</span>";
        activityHtml += "<span class='octicon octicon-git-branch activity-icon'></span></div></div>";
      }
      else {
        activityHtml += "repository at <a href='" + activityList.repo.url + "'><span class='file-path'>" + activityList.repo.name + "</span></a> <span class='time-ago'>" + moment(activityList.created_at, "YYYYMMDDH").fromNow() + "</span>";
        activityHtml += "<span class='octicon octicon-repo activity-icon'></span></div></div>";
      }
    }
    else {
      activityHtml += "<div class='activity-list border-top push'>"
                      + "<div class='activity-text'>"
                        + "<span class='time-ago'>" + moment(activityList.created_at, "YYYYMMDDH").fromNow() + " ago</span>"
                        + "<div class='title'>"
                          + "<a href='" + userData.html_url + "'><span class='username'>" + activityList.actor.login + "</span></a> pushed to <a href='#'><span class='branch-name'>master</span></a> at <a href='" + activityList.repo.url + "'><span class='file-path'>" + activityList.repo.name + "</span></a>"
                        + "</div>"
                        + "<div class='details'>"
                          + "<a href='" + userData.html_url + "'><img class='avatar' src='" + activityList.actor.avatar_url + "' alt=''/></a>"
                          + "<span class='octicon octicon-mark-github'></span>"
                          + "<a href='#' class='head'>e0bde6e</a>" + activityList.payload.commits[0].message
                        + "</div>"
                        + "<span class='mega-octicon octicon-git-commit activity-icon'></span>"
                      + "</div>"
                    + "</div>";
    }
  });
  $('.activity-feed').append(activityHtml);
};

var $repotab = $('#repo-tab');
var $repobox = $('.repos');
var $activitytab = $('#activity-tab');
var $activityfeed = $('.activity-feed');
$activitytab.click(function(event) {
  event.preventDefault();
  $activitytab.addClass('current-tab');
  $activityfeed.removeClass('hidden');
  $repobox.addClass('hidden');
  $repotab.removeClass('current-tab');
});

$repotab.click(function(event) {
  event.preventDefault();
  $repotab.addClass('current-tab');
  $repobox.removeClass('hidden');
  $activitytab.removeClass('current-tab');
  $activityfeed.addClass('hidden');
});

var $all = $('.all-filter');
var $pub = $('.public-filter');
var $priv = $('.private-filter');
var $sources = $('.sources-filter');
var $forks = $('.forks-filter');
var $mirrors = $('.mirrors-filter');

$all.click(function(event) {
  event.preventDefault();
  $all.addClass('current-filter');
  $all.siblings().removeClass('current-filter');
  setRepoHtml(sortReposByUpdate(repos));
});

$pub.click(function(event) {
  event.preventDefault();
  $pub.addClass('current-filter');
  $pub.siblings().removeClass('current-filter');
  setRepoHtml(sortReposByUpdate(getPublicRepos()));
});

var getPublicRepos = function() {
  var publicRepos = repos.filter(function(repo) {
    return repo.private === false;
  });
  return publicRepos;
};

$priv.click(function(event) {
  event.preventDefault();
  $priv.addClass('current-filter');
  $priv.siblings().removeClass('current-filter');
  setRepoHtml(sortReposByUpdate(getPrivateRepos()));
});

var getPrivateRepos = function() {
  var privateRepos = repos.filter(function(repo) {
    return repo.private === true;
  });
  return privateRepos;
};

$sources.click(function(event) {
  event.preventDefault();
  $sources.addClass('current-filter');
  $sources.siblings().removeClass('current-filter');
  setRepoHtml(sortReposBySource());
});

var sortReposBySource = function() {
  return _.sortBy(repos, 'language');
};

$forks.click(function(event) {
  event.preventDefault();
  $forks.addClass('current-filter');
  $forks.siblings().removeClass('current-filter');
  setRepoHtml(sortReposByForks());
});

var sortReposByForks = function() {
  return _.sortBy(repos, 'forks_count').reverse();
};

$('.mirrors-filter').click(function(event) {
  event.preventDefault();
    $mirrors.addClass('current-filter');
    $mirrors.siblings().removeClass('current-filter');
    setRepoHtml(sortReposByMirrors());
});

var sortReposByMirrors = function() {
  return _.sortBy(repos, 'stargazers_count').reverse();
};

setUserHtml();
setRepoHtml(sortReposByUpdate(repos));
setActivityHtml(activities);
