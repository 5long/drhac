(function() {

module('Player');

drhac.config = {
    set: function(name, value) {
    equal(name, 'playerStatus', 'player only sets this key');
    this.playing = value;
  }
  , get: function(name) {
    equal(name, 'playerStatus', 'only gets this key');
    return this.playing;
  }
};
var node = document.createElement('audio'),
  url = 'data/music.mp3',
  nextUrl = 'data/next.mp3',
  p = drhac.Player(node, false);

function handlePlay (e) {
  start();
  equal(e.type, 'play', 'Play event emitted');
  same(this, e.target, 'Happens on the node');
  this.removeEventListener('play', handlePlay);
}

function handleEnd (e) {
  start();
  equal(e.type, 'ended', 'Ended event emitted');
  same(this, e.target, 'Happens on the node');
  this.removeEventListener('ended', handleEnd);
}

asyncTest('play method', function() {
  expect(2);
  function testPlay() {
		start();
		ok(true, 'Playback begins');
		equal(node.src.slice( - url.length), url, 'URL is right');
    // Clean itself for later test.
    node.removeEventListener("play", testPlay);
  }

	// Display it for debugging.
	node.controls = true;
	document.body.appendChild(node);

	stop();
	node.addEventListener("play", testPlay);
	p.play(url);
});

test('append method', function() {
  var p = drhac.Player(document.createElement("audio"), false);
  p.append([1,2,3]);
  same(p.playlist, [1,2,3], 'initial append');
  p.append([4,5,6]);
  same(p.playlist, [1,2,3,4,5,6], 'append again');
});

asyncTest('playNext method', function() {
  expect(7);

  function playOnNode (){
    start();
    ok(true, 'play event emitted');
    equal(node.src.slice(-nextUrl.length), nextUrl, 'URL changed');
    equal(p.curSong.url, nextUrl, 'Assigned to p.curSong');
    this.removeEventListener('play', playOnNode);
  }

  function playBeginSub (song, player) {
    ok(true, 'Listener fired');
    equal(song.url, nextUrl, 'Got the song\'s information');
    equal(player, p, 'fired from the player');
    ijl.unsub('playbackBegin', playBeginSub);
  }

  function playlistRunningOutSub(song, player) {
    ok(true, 'Event playlistRunningOut fired');
    ijl.unsub('playlistRunningOut', playlistRunningOutSub);
  }

  stop();
  node.addEventListener('play', playOnNode);
  p.playlist = [{url:nextUrl}];
  ijl.sub('playbackBegin', playBeginSub);
  ijl.sub('playlistRunningOut', playlistRunningOutSub);
  p.playNext();
  
});

asyncTest('onEnded method', function() {
  expect(2);
  
  stop();
  var node=document.createElement('audio'),
    p=drhac.Player(node, false);

  function playEndedSub (song, player) {
    start();
    equal(song.url, url, "Got song\'s url");
    equal(player, p, 'fired from the player');
    ijl.unsub('playbackEnded', playEndedSub);
  }
  
  p.curSong = {url:url};
  ijl.sub('playbackEnded', playEndedSub);
  simE(node, 'ended');
});

asyncTest('sub() and not autoplay', function() {
  expect(4);
  var p = drhac.Player(document.createElement("audio"), false);

  equal(p.playlist.length, 0, 'no songs in list');
  ok(!p.playing, 'not allowed to autoplay');
  stop();
  ijl.pub("playlistLoad", [1,2,3]);
  setTimeout(function() {
    start();
    equal(p.playlist[1], 2, 'songs pushed');
    equal(p.playlist[0], 1, 'songs pushed');
  }, 20);
});

asyncTest('on method', function() {
  expect(4);

  stop();
  p.on('play', handlePlay);
  p.on('ended', handleEnd);
  simE(node, 'play');
  stop();
  setTimeout(function() {
    simE(node, 'ended');
  }, 10);
});

asyncTest('onError method', function() {
  expect(1);
  var node=document.createElement('audio'),
    p=drhac.Player(node, false);
  p.playing = true;

  p.playNext = function() {
    start();
    ok(true, 'this.playNext called');
  };

  stop();
  simE(node, 'error');

});

test('pub() and autoplay', function() {
  expect(2);
  stop();

  _turnOn = drhac.Player.prototype.turnOn;
  drhac.Player.prototype.turnOn = function() {
    ok(true, 'turnOn method is called');
  };
  var node = document.createElement("audio"),
    p = drhac.Player(node, true);
  drhac.Player.prototype.turnOn = _turnOn;
  equal(p.node, node, 'node assigned');
});

asyncTest('turnOff method', function() {
  expect(5);
  var node = document.createElement("audio"),
    p = drhac.Player(node, false);
  p.saveStatus = function() {
    ok(true, 'saveStatus() called');
  };
  equal(typeof p.turnOff, 'function', 'has turnOff method');
  p.play(url);
  stop();
  setTimeout(function() {
    p.turnOff();
    ok(!p.playing, 'Stopped playing after method call');
    notEqual(node.currentSrc, url, "url changed");
    ok(!node.currentTime, 'Time pointer at the beginning');
    start();
  }, 30);
});

asyncTest('turnOn method', function() {
  expect(6);
  var p = drhac.Player(document.createElement("audio"), false);
  p.saveStatus = function() {
    ok(true, 'saveStatus() called');
  };
  ok(!p.playing, 'not autoplaying');
  stop();
  ijl.sub('playerTurnedOn', function(song, player) {
    ok(true, 'playerTurnedOn event fired');
    equal(song, null, 'place holder of song');
    equal(player, p, 'player passed in');
    ok(p.playing, 'playing flag');
    start();
  });
  p.turnOn();
});

test('toggle method', function() {
  var p = drhac.Player(document.createElement("audio"), false),
  counter = 0;
  p.turnOn = function() {
    ok(true, 'turnOn method called');
    this.playing = true;
    counter++;
  };
  p.turnOff = function() {
    ok(true, 'turnOff method called');
    equal(counter, 1, 'called after turnOn');
  };
  ok(!p.playing, 'not playing at first');
  p.toggle();
  p.toggle();
});

test('saveStatus method', function() {
  var p = drhac.Player(document.createElement("audio"), false)
    , cfg=drhac.config;
  p.saveStatus();
  strictEqual(cfg.playing, false, "not autoplay by default");
  p.playing = true;
  p.saveStatus();
  strictEqual(cfg.playing, true, 'status saved');
});

test('loadStatus method', function() {
  var p = drhac.Player(document.createElement("audio"), false)
    , cfg = drhac.config;
  cfg.playing = true;
  strictEqual(p.loadStatus(), true, 'status loaed');
  cfg.playing = false;
  strictEqual(p.loadStatus(), false, 'status loaed');
});

asyncTest('skipCurrent', function() {
  expect(3);
  var p = drhac.Player(document.createElement("audio"), false)
    , song = {};
  p.curSong = song;
  p.playNext = function() {
    ok(true, 'called playNext method');
  };
  function playbackSkippedSub (s, player) {
    equal(s, song, 'skip current song');
    equal(player, p, 'emitted from that player');
    start();
    ijl.unsub("playbackSkipped", playbackSkippedSub);
  }
  ijl.sub("playbackSkipped", playbackSkippedSub);
  p.playing = true;
  p.skipCurrent();
  stop();
});

})();
