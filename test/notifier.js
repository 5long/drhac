(function() {

module("notifier");

var mockBrowserAction = {
  // currently not used
  onClicked: {
    list: [],
    addListener: function(fn) {
      this.list.push(fn);
    },
    hasListener: function(fn) {
      return this.list.indexOf(fn) > -1;
    }
  },

  setTitle: function(details) {
    if (details && details.hasOwnProperty('title')) {
      this.title = details.title;
    } else {
      throw new Error("no title property on 1st parameter");
    }
  },

  setBadgeText: function(details) {
    if (details && details.hasOwnProperty('text')) {
      this.badgeText = details.text;
    } else {
      throw new Error("no text property on 1st parameter");
    }
  },

  setIcon: function(details) {
    if (details && details.path) {
      this.imagePath = details.path;
    } else {
      throw new Error("must specify path property");
    }
  },

  setBadgeBackgroundColor: function(details) {
    this.color = details.color;
  },

  title: "DrhAc",
  badgeText: "",
  imagePath: "logo_off.png"
}

  , merge = ijl.merge
  , n=drhac.Notifier(mockBrowserAction)
  , dummySong={
    sid:42
    , picture:'http://t.douban.com/mpic/s3268875.jpg'
    , title: '1234567'
    , artist: '\u6efe\u7eee\u8d1e'
    , albumtitle: 'Groupies \u5409\u4ed6\u624b'
    , like: 1
  }
  , cleanSong={
    title: 'nope'
    , artist: 'nope'
  };

var title = dummySong.title + " - " + dummySong.artist;

test('constructor', function() {
  ok(n instanceof drhac.Notifier, 'is an instance');
  equal(n.icon, mockBrowserAction, 'icon assigned');
});

test('showSong method', function() {
  n.showSong(dummySong);
  equal(mockBrowserAction.title, title, 'title is set');
  equal(mockBrowserAction.badgeText, "♥", 'show heart symbol for liked song');
  try {
    n.showSong();
    n.showSong({});
    n.showSong('foo');
  } catch (e) {
    ok(false, 'shouldn\'t throw error');
  }
  equal(mockBrowserAction.title, title, 'title is not modified');
  n.showSong(cleanSong);
  strictEqual(mockBrowserAction.badgeText, '', 'badgeText cleaned for unliked song');
});

test('activate', function() {
  mockBrowserAction.imagePath = "";
  n.activate();
  equal(mockBrowserAction.imagePath, "logo_128.png", 'set logo as power on');
});

asyncTest("on playbackBegin", function() {
  expect(1);
  stop();
  ijl.pub('playbackBegin', dummySong);
  setTimeout(function() {
    equal(mockBrowserAction.title, title, 'title is set');
    start();
  }, 100);
});

test('resetDisplay', function() {
  mockBrowserAction.badgeText = "foo";
  mockBrowserAction.imagePath = "lol.gif";
  n.resetDisplay();
  equal(mockBrowserAction.title, 'DrhAc', 'title is reset');
  strictEqual(mockBrowserAction.badgeText, "", "badgeText is reset");
  equal(mockBrowserAction.imagePath, "logo_off.png", 'imagePath is reset');
});

asyncTest('on playerTurnedOff', function() {
  expect(1);
  stop();
  var icon = merge({}, mockBrowserAction)
    , noti = drhac.Notifier(icon);
  icon.title = "foo";
  ijl.pub("playerTurnedOff");
  setTimeout(function() {
    equal(icon.title, "DrhAc", 'title is reset');
    start();
  }, 100);
});

asyncTest('on playerTurnedOn', function() {
  expect(1);
  stop();
  var icon = merge({}, mockBrowserAction)
    , noti = drhac.Notifier(icon);
  icon.imagePath =  "foo";
  ijl.pub("playerTurnedOn");
  setTimeout(function() {
    equal(icon.imagePath, "logo_128.png", 'icon set as turned on');
    start();
  }, 100);
});

})();
