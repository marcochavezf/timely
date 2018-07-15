/**
 * Created by marcochavezf on 9/4/17.
 */
var _pageview = null;
function initAnalytics(pageview) {
	chrome.identity.getProfileUserInfo(function (userInfo) {
		/* Use userInfo.email, or better (for privacy) userInfo.id
		 They will be empty if user is not signed in in Chrome */
		(function (i, s, o, g, r, a, m) {
			i['GoogleAnalyticsObject'] = r;
			i[r] = i[r] || function () {
					(i[r].q = i[r].q || []).push(arguments)
				}, i[r].l = 1 * new Date();
			a = s.createElement(o),
				m = s.getElementsByTagName(o)[0];
			a.async = 1;
			a.src = g;
			m.parentNode.insertBefore(a, m)
		})(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');

		ga('create', 'UA-122333256-1', 'auto', {userId: userInfo.id});
		ga('set', 'checkProtocolTask', function () {
		}); // Removes failing protocol check. @see: http://stackoverflow.com/a/22152353/1958200
		ga('require', 'displayfeatures');
		ga('send', 'pageview', pageview);
	});
	_pageview = pageview;
}

function executeWithErrorHandling(fn) {
	try {
		fn();
	} catch (e) {
		//capture expception
		ga('send', 'exception', {
			'exDescription': JSON.stringify({ message: e.message, stack: e.stack }),
			'exFatal': true
		});
		chrome.runtime.reload();
	}
}

function trackEventAnlytics(eventAction, eventLabel){
	if (!_pageview) {
		return;
	}
	ga('send', {
		hitType: 'event',
		eventCategory: _pageview,
		eventAction: eventAction,
		eventLabel: String(eventLabel)
	});
}