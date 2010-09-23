(function() {

module('config');

var cfg=drhac.config
  , ls=localStorage;

test('use', function() {
  var foo = {};
  equal(cfg.ls, ls, 'using localStorage by default');
  cfg.use(foo);
  equal(cfg.ls, foo, 'using fake one');
  cfg.use();
  equal(cfg.ls, ls, 'using original one');
});

test('set', function() {
  cfg.set("foo", 42);
  deepEqual(ls.foo, '42', 'set on ls');
  cfg.set("bar", {foo:42});
  deepEqual(ls.bar, '{"foo":42}', 'works on real ls');
});

test('get', function() {
  var bar = cfg.get("bar");
  deepEqual(bar, {foo:42}, "got parsed object");
});

})();
