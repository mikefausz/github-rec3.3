var setUserHtml = function() {
    $('.name-box').find('h1').text(userData.name);
    $('.name-box').find('h2').text(userData.login);
    $('aside').find('.location').text(userData.location);
    $('aside').find('.date-joined').text("Joined on " + moment(userData.created_at).format('MMM D, YYYY'));
    $('.stat-box').find('.followers').text(userData.followers);
    $('.stat-box').find('.starred').text("0");
    $('.stat-box').find('.following').text(userData.following);
}

var sortReposByUpdate = function(rawRepos) {
  return _.sortBy(rawRepos, 'updated_at').reverse();
}

var setRepoHtml = function(repoData) {
  var repoHtml = "";
  repoData.forEach(function(repo) {
    repoHtml += "<div class='repo-list'>";
    repoHtml += "<div class='repo-stats'>";
    repoHtml += "<span class='repo-lang'>" + repo.language + "</span>";
    repoHtml += "<a href='#' class='repo-stat-item'><span class='octicon octicon-star'></span>" + repo.stargazers_count + "</a>";
    repoHtml += "<a href='#' class='repo-stat-item'><span class='octicon octicon-git-branch'></span>" + repo.forks_count + "</a></div>";
    repoHtml += "<h3 class='repo-list-name'>" + repo.name + "</h3>";
    repoHtml += "<p class='repo-desc'>" + repo.description + "</p>";
    repoHtml += "<p class='repo-last-up'>Updated " + moment(repo.updated_at, "YYYYMMDDH").fromNow() + "</p></div>";
  });
  $('.repo-box').html(repoHtml);
};

var setActivityHtml = function(activityData) {
  var activityHtml = "";
  activityData.forEach(function(activityList) {
    if (activityList.type === "CreateEvent") {
      activityHtml += "<div class='activity-list border-top'>";
      activityHtml += "<div class='activity-text'>";
      activityHtml += "<span class='username'>" + activityList.actor.login + "</span> created ";
      if (activityList.payload.ref_type === "branch") {
        activityHtml += "branch <span class='branch-name'>" + activityList.payload.ref +  "</span> at <span class='file-path'>" + activityList.repo.name + "</span> <span class='time-ago'>" + moment(activityList.created_at, "YYYYMMDDH").fromNow() + "</span>";
        activityHtml += "<span class='octicon octicon-git-branch activity-icon'></span></div></div>";
      }
      else {
        activityHtml += "repository at <span class='file-path'>" + activityList.repo.name + "</span> <span class='time-ago'>" + moment(activityList.created_at, "YYYYMMDDH").fromNow() + "</span>";
        activityHtml += "<span class='octicon octicon-repo activity-icon'></span></div></div>";
      }
    }
    else {
      activityHtml += "<div class='activity-list border-top push'>";
      activityHtml += "<div class='activity-text'>";
      activityHtml += "<span class='time-ago'>" + moment(activityList.created_at, "YYYYMMDDH").fromNow() + " ago</span>";
      activityHtml += "<div class='title'>";
      activityHtml += "<span class='username'>" + activityList.actor.login + "</span> pushed to <span class='branch-name'>master</span> at <span class='file-path'>" + activityList.repo.name + "</span></div>";
      activityHtml += "<div class='details'>";
      activityHtml += "<img class='avatar' src='" + activityList.actor.avatar_url + "' alt=''/>";
      activityHtml += "<span class='octicon octicon-mark-github'></span>";
      activityHtml += "<span class='head'>e0bde6e</span>" + activityList.payload.commits[0].message + "</div>";
      activityHtml += "<span class='mega-octicon octicon-git-commit activity-icon'></span></div></div>";
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
