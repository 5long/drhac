<?php
$data = <<<EOF
{
  "r": 0,
  "song": [
    {"url":"music.mp3"},
    {"url":"next.mp3"}
  ]
}
EOF;

if (isset($_GET['uid']) && isset($_GET['type'])) {
  echo $data;
}
