// Quick and dirty, really.
var pageBg = {};
pageBg.audioNode = document.querySelector('audio#drhac-player');
pageBg.notifier = drhac.Notifier(chrome.browserAction);
pageBg.drhacPlayer = drhac.Player(pageBg.audioNode);
pageBg.dbfm = drhac.BeanFm();
chrome.browserAction.onClicked.addListener(function() {
  pageBg.drhacPlayer.toggle();
});
