const { writeFile } = require('fs/promises');

const getOCWAMeetings = () => {
  fetch("https://go.boarddocs.com/ny/ocwa/Board.nsf/BD-GetMeetingsList?open&0.9541476706708205", {
    "body": "current_committee_id=A9QN5Z5E5509",
    "method": "POST"
  })
  .then(r => r.json())
  .then(r => r.map(meeting => `${meeting.numberdate} ${meeting.name}`))
  .then(m => writeFile('ocwa-meetings.html', `<body>${m.join("\n")}</body>`));
};

[
  getOCWAMeetings
].forEach(fn => fn());
