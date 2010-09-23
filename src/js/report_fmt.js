(function(context, name) {
	var drhac = context[name] = context[name] || {};

  drhac.reportFmt = {
    playbackEnded: function(song) {
      return {
        type: "e", sid: song.sid, status: "p"
      };
    },

    longReport: function(song, player, history) {
      var playlist = player && player.playlist;
      return {
        sid: song && song.sid,
        aid: song && song.aid,
        rest: playlist && playlist.length
          ? playlist.map(function(song) {return song.sid + '';}).join('|')
          : '',
        h: history && history + ''
      };
    },

    playlistRunningOut: function(song, player, history) {
      return ijl.merge({type:"p"},
        this.longReport(song, player, history));
    },

    playerTurnedOn: function(song, player, history) {
      return ijl.merge({type:"n"}, 
        this.longReport(song, player, history));
    },

    playbackSkipped: function(song, player, history) {
      return ijl.merge({type:"s"},
        this.longReport(song, player, history));
    },
  }

})(this, 'drhac');
