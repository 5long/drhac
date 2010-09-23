module('drhac.report_fmt')

test('prepare report', function() {
  var p=drhac.reportFmt,
    song = {sid: 42, aid: 2},
    player = {
        playlist: [{sid: 5}, {sid: 7}]
      },
    history = drhac.History();
  history.list = [
   {type:"p", id:42},
   {type:"s", id:425}
  ];

  deepEqual(p.playbackEnded(song),
    {type:"e", sid: song.sid, status: "p"},
    "report for playbackEnded");
  deepEqual(p.playlistRunningOut(song, player, history),
    {type:"p", sid: song.sid, aid:song.aid,
      rest: "5|7",
      h: "42:p|425:s"},
    "report for playlistRunningOut");
  deepEqual(p.playerTurnedOn(null, player, history),
    {type:"n", h:"42:p|425:s",
      sid: null, aid: null,
      rest: "5|7"}, "report for playerTurnedOn");
  deepEqual(p.playbackSkipped(song, player, history),
    {type:"s", sid: song.sid, aid: song.aid,
      rest: "5|7",
      h: "42:p|425:s"},
    "report for playbackSkipped");
});
