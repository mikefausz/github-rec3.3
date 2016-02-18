var setUserHtml = function() {
    $('.name-box').find('h1').text(userData.name);
    $('.name-box').find('h2').text(userData.login);
    $('aside').find('.location').text(userData.location);
    $('aside').find('.date-joined').text("Joined on " + moment(userData.created_at).format('MMM D, YYYY'));
    $('.stat-box').find('.followers').text(userData.followers);
    $('.stat-box').find('.starred').text("0");
    $('.stat-box').find('.following').text(userData.following);
}

var getJoinDateStr = function() {
  var joinDateStr = "";
  var joinDate = new Date(userData.created_at);
  var joinMonth = joinDate.getMonth();
  switch(joinMonth) {
    case 0:
      joinDateStr += "January ";
      break;
    case 1:
      joinDateStr += "February ";
      break;
    case 2:
      joinDateStr += "March ";
      break;
    case 3:
      joinDateStr += "April ";
      break;
    case 4:
      joinDateStr += "May ";
      break;
    case 5:
      joinDateStr += "June ";
      break;
    case 6:
      joinDateStr += "July ";
      break;
    case 7:
      joinDateStr += "August ";
      break;
    case 8:
      joinDateStr += "September ";
      break;
    case 9:
      joinDateStr += "October ";
      break;
    case 10:
      joinDateStr += "November ";
      break;
    case 11:
      joinDateStr += "December ";
      break;
    default:
      joinDateStr += "Unknown ";
  }
  joinDateStr += joinDate.getDate() + ", " + joinDate.getFullYear();
  return joinDateStr;
}

var sortRepoData = function() {
  var sortedRepos= _.sortBy(repos, 'updated_at').reverse();
  var repoData = repos.map(function(repo) {
    return {
      name: repo.name,
      description: repo.description,
      updated_at: repo.updated_at,
      language: repo.language,
      stargazers_count: repo.stargazers_count,
      forks_count: repo.forks_count,
    };
  });
  return repoData;
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
var $sources = $('sources-filter');
var $forks = $('.forks-filter');
var $mirrors = $('.mirrors-filter');

$('.all-filter').click(function(event) {
  event.preventDefault();
  if(!$all.hasClass('current-filter')) {
    $all.addClass('current-filter');
    $pub.removeClass('current-filter');
    $priv.removeClass('current-filter');
    $sources.removeClass('current-filter');
    $forks.removeClass('current-filter');
    $mirrors.removeClass('current-filter');
    setRepoHtml(sortRepoData());
  }
});

$('.public-filter').click(function(event) {
  event.preventDefault();
  if(!$pub.hasClass('current-filter')) {
    $all.removeClass('current-filter');
    $pub.addClass('current-filter');
    $priv.removeClass('current-filter');
    $sources.removeClass('current-filter');
    $forks.removeClass('current-filter');
    $mirrors.removeClass('current-filter');
    setRepoHtml(getPublicRepos());
  }
});

var getPublicRepos = function() {
  var publicRepos = repos.filter(function(repo) {
    return repo.private === false;
  });
  return publicRepos;
};

$('.private-filter').click(function(event) {
  event.preventDefault();
  if(!$priv.hasClass('current-filter')) {
    $all.removeClass('current-filter');
    $pub.removeClass('current-filter');
    $priv.addClass('current-filter');
    $sources.removeClass('current-filter');
    $forks.removeClass('current-filter');
    $mirrors.removeClass('current-filter');
    setRepoHtml(getPrivateRepos());
  }
});

var getPrivateRepos = function() {
  var privateRepos = repos.filter(function(repo) {
    return repo.private === true;
  });
  return privateRepos;
};
$('.sources-filter').click(function(event) {
  event.preventDefault();
  if(!$sources.hasClass('current-filter')) {
    $all.removeClass('current-filter');
    $pub.removeClass('current-filter');
    $priv.removeClass('current-filter');
    $sources.addClass('current-filter');
    $forks.removeClass('current-filter');
    $mirrors.removeClass('current-filter');
    setRepoHtml(sortReposBySource());
  }
});

var sortReposBySource = function() {
  return _.sortBy(repos, 'language');
};

$('.forks-filter').click(function(event) {
  event.preventDefault();
  if(!$forks.hasClass('current-filter')) {
    $all.removeClass('current-filter');
    $pub.removeClass('current-filter');
    $priv.removeClass('current-filter');
    $sources.removeClass('current-filter');
    $forks.addClass('current-filter');
    $mirrors.removeClass('current-filter');
    setRepoHtml(sortReposByForks());
  }
});

var sortReposByForks = function() {
  return _.sortBy(repos, 'forks_count').reverse();
};
$('.mirrors-filter').click(function(event) {
  event.preventDefault();
  if(!$mirrors.hasClass('current-filter')) {
    $all.removeClass('current-filter');
    $pub.removeClass('current-filter');
    $priv.removeClass('current-filter');
    $sources.removeClass('current-filter');
    $forks.removeClass('current-filter');
    $mirrors.addClass('current-filter');
    setRepoHtml(sortReposByMirrors());
  }
});

var sortReposByMirrors = function() {
  return _.sortBy(repos, 'stargazers_count').reverse();
};
setUserHtml();
setRepoHtml(sortRepoData());
setActivityHtml(activities);
