(function() {
  
module('bean_fm');

var uidData = [
  {
    string: "omg uid = '256'",
    result: 256,
    info: 'equal sign, space at both sides'},
  {
    string: 'uid: "128"',
    result: 128,
    info: 'colon, space in the right'},
  {
    string: 'uid:456',
    result: 456,
    info: 'colon, no space and quotes'}
];

var url = 'data/echo_query.php'

var dbfmDummy = drhac.BeanFm('12.7ff', url);

var dummySong = {type:"meet the need of conn()",
  attribute:"oops"};

test('constructor and init', function() {
  equal(dbfmDummy.url, url, 'Base url constructed');
  equal(dbfmDummy.uid, 12, 'uid assigned');
  ok(dbfmDummy.initialized, 'initialized');
  ok(dbfmDummy.history instanceof drhac.History, 'has a History object');
});

test('extractUid', function() {
  uidData.forEach(function(obj) {
    equal(dbfmDummy.extractUid(obj.string), obj.result, obj.info);
  });
});

test('report method', function() {
  expect(5);

  var _append = dbfmDummy.history.append;
  var dummyPlayer = {};

  dbfmDummy.history.append = function(type, song) {
    equal(type, "foo", 'called append on history');
    deepEqual(song, dummySong, 'song passed in');
  };
  dbfmDummy.prepareReport.foo = function(song, player, history) {
    equal(song, dummySong, 'song passed in');
    equal(player, dummyPlayer, 'player passed in');
    equal(history, dbfmDummy.history, 'history passed in');
    return song;
  };
  dbfmDummy.report("foo", dummySong, dummyPlayer);

  dbfmDummy.history.append = _append;
});

asyncTest('findUid method', function() {
  expect(1);
  stop();
  
  dbfmDummy.findUid(function(uidFound) {
    setTimeout(function() {
      start();
      equal(uidFound, 42, 'Found uid from the mud');
    }, 10);
  }, "data/uid_42_in_soup.php");
});

asyncTest('sub()', function() {
  expect(5);
  
  var dbfm = drhac.BeanFm(1, url);
    dummyPlayer = {},
    counter = 0, 

    dbfm.report = function(type, song, player) {
      if (type != 'playerTurnedOn') {
        equal(song, dummySong, 'song passed in');
        equal(player, dummyPlayer, 'player passed in');
      }
      counter++;
    };
  // reinit to bind on the mock method, which also fires playerTurnedOn
  dbfm.init(1);
  stop();
  ijl.pub('playbackEnded', dummySong, dummyPlayer);
  ijl.pub('playlistRunningOut', dummySong, dummyPlayer);
  ijl.pub('playerTurnedOn');
  setTimeout(function() {
    equal(counter, 4, '4 events emitted');
    start();
  }, 100);
});

})();

