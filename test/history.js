module('drhac.History');

(function() {

var h = drhac.History(2, [5,6,7,8]);

test('constructor', function() {
  equal(h.limit, 2, 'Assigned limit');
  deepEqual(h.list, [7,8], 'truncated list');

  var yah = drhac.History();
  equal(yah.limit, 20, 'default limit');
  deepEqual(yah.list, [], 'empty as default');
});

test('append method', function() {
  h.append('playbackEnded', {sid:42});
  h.append('playbackSkipped', {sid:425});
  deepEqual(h.list[0], {type:"p",id:42}, "");
  deepEqual(h.list[1], {type:"s",id:425}, "");
});

test('toString', function() {
  equal(h, "42:p|425:s", '');
  equal(decodeURI(encodeURI(h)), "42:p|425:s", '');
});

})();
