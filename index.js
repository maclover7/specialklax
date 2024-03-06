const { writeFile } = require('fs/promises');
const cheerio = require('cheerio');

// ** Helper functions ** //
const getLegislationWithStatusOffset = (status, offset) => {
  const params = new URLSearchParams({
    'term': `status.statusType:${status}`,
    'limit': 1000,
    'offset': offset,
    'sort': 'status.actionDate:DESC',
    'type': 'published',
    'key': process.env.LEGISLATION_API_KEY
  });

  return fetch(`https://legislation.nysenate.gov/api/3/bills/2023/search?${params}`)
    .then(r => r.json())
    .then(r => r.result.items.map(i => i.result));
};

const getLegislationWithStatus = (status) => {
  return Promise.all(
    [0, 1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000].map((offset) =>
    getLegislationWithStatusOffset(status, offset)))
    .then((...bills) => Promise.resolve(bills.flat().flat()))
    .then(bills => bills.filter(b => !b.billType.resolution));
};

// ** //

const getCampaignFilersToday = () => {
  fetch("https://publicreporting.elections.ny.gov/ActiveDeactiveFiler/ActiveDeactiveFiler?lstDateType=Today&lstUCOfficeType=&lstStatus=All&lstFilerType=&ddlCommitteeType=&txtDateFrom=&txtDateTo=&Command=CSV&listOfFilerGrid_length=10", {
    "headers": {
      "cookie": "nmstat=8cf801ff-a613-bdb6-976d-a83957031baa; _ga_314S0P3JTR=GS1.1.1690420964.1.0.1690420978.0.0.0; _ga_KJEBZ3Z5XQ=GS1.1.1690420965.1.0.1690420978.0.0.0; _gcl_au=1.1.502699486.1696633973; _scid=1f39c036-de0d-4d7d-8385-8840547b0b11; _gd1696643423757=_gd1696643423757; _gd1696643423758=_gd1696643423758; tint-anonymous-uid=a02fc44d-de6d-4564-8597-92fa6ae37b8c; _ga_S65XNWX5XP=GS1.2.1696642904.1.1.1696643446.0.0.0; _ga_LKJLF04R2K=GS1.1.1696651767.2.1.1696652853.60.0.0; _ga_6ZBMQSW4B9=GS1.1.1696652494.4.1.1696652880.0.0.0; _ga_ELBGG9P1SK=GS1.1.1696725529.1.0.1696725561.0.0.0; _ga_906E6XQKX7=GS1.1.1696808157.1.1.1696808204.0.0.0; _ga_XFQ81X2Z68=GS1.1.1696907317.1.1.1696907355.0.0.0; _ga_R2R8CZ1Y79=GS1.1.1696907317.1.1.1696907355.0.0.0; _ga_5BXW76EKM5=GS1.1.1697338196.1.1.1697338283.0.0.0; rxVisitor=1697575084034H8MFLP3IJH5JC30CCN79BTF4SRQFAEHO; _ga_8VMGW71M6L=GS1.1.1697774131.2.1.1697774343.0.0.0; _ga_6T5W7WYBCN=GS1.1.1697774131.2.1.1697774343.0.0.0; _ga_12E956GW0J=GS1.1.1697774131.2.1.1697774343.0.0.0; _ga_FRHFK8YBPJ=GS1.1.1697774131.2.1.1697774343.0.0.0; _ga_SVY9N7WVF3=GS1.2.1698001609.1.0.1698001609.0.0.0; _ga_5MGSXHK8QH=GS1.1.1698026588.3.1.1698026895.0.0.0; _ga_8HVP8GF867=GS1.1.1698026964.1.1.1698026995.0.0.0; _ga_QQ78ML9SFP=GS1.1.1698534433.6.1.1698534754.0.0.0; ASP.NET_SessionId=nmwngnd4b2uo1r0g3ug1lbcu; _tt_enable_cookie=1; _ttp=Lw_un0ho7NfR4ul80_3kLd9Bq0A; _sctr=1%7C1699678800000; _scid_r=1f39c036-de0d-4d7d-8385-8840547b0b11; _uetvid=fb258ca080df11eea6d507cfbd1f262b; _ga_PWECYM2278=GS1.1.1699740996.1.1.1699741665.0.0.0; _ga_YEEFSEGRZ4=GS1.2.1699767195.3.1.1699768068.0.0.0; _ga_MVSR6XB0E1=GS1.1.1699767195.4.1.1699768268.0.0.0; _ga_1D6F62T597=GS1.1.1700021526.13.0.1700021531.0.0.0; _ga_G1QCTW35ZG=GS1.1.1700101730.1.0.1700101738.0.0.0; _ga_ZNNFJGFKZ4=GS1.1.1700436030.1.0.1700436037.0.0.0; _ga_QJ09742C6Q=GS1.1.1700505061.3.1.1700505084.0.0.0; _ga_HBKGFQC6H6=GS1.1.1701302084.1.1.1701302119.0.0.0; _ga_2PTLVG5G53=GS1.1.1701321523.2.1.1701321554.0.0.0; rxvt=1701482084745|1701480246098; dtPC=3$480246079_564h-vMNTDKRTBORIJLLRGAKUEWLARKCRITCQV-0e0; dtSa=true%7CKD%7C-1%7COCWA%20%3A%20Annual%20Water%20Quality%20Report%202022%7C-%7C1701480291082%7C480246079_564%7Chttps%3A%2F%2Fwater.ny.gov%2Fdoh2%2Fapplinks%2Fwaterqual%2F%7C%7C%7C%2FwaterSystems%7C; _fbp=fb.1.1701894520550.493211360; _ga_DRYJB34TXH=GS1.1.1701894520.1.1.1701894860.0.0.0; _ga_KJ775F1QKV=GS1.1.1701928828.3.0.1701928831.0.0.0; _ga_6H131E2XHX=GS1.1.1702139277.7.0.1702139844.0.0.0; fpestid=K8d1fRzcwoYjuzL7acO85XQ2-l4K3MSk1FwLXyhRwDhVepSmF1jYSPBC3LCung_ShIo7Vg; _ga_88NRD2W5YY=GS1.1.1702233975.3.1.1702234413.0.0.0; _ga_CRLHC53YYS=GS1.1.1702273844.1.1.1702274002.0.0.0; _ga_F14HJB55LQ=GS1.1.1702273735.1.1.1702274004.0.0.0; _ga_DB9MQJQJ8Z=GS1.1.1702694969.2.1.1702695169.46.0.0; _ga_PZ2TM1GCPQ=GS1.1.1702694552.5.1.1702695894.0.0.0; _ga_JSD5F49M6Q=GS1.1.1702839488.2.1.1702839511.0.0.0; dtCookie=v_4_srv_3_sn_78D1DE4C93E60CEB107CDA71DE19C7D0_perc_100000_ol_0_mul_1_app-3A56a8a44decf50ba7_0_app-3A4ef0cc07ff547cc9_1_app-3Ac428db55fc2953b9_0_app-3A100f7303070dbb78_1_app-3A998701f0ddcff8d4_0; _gid=GA1.2.768263069.1703045672; _ga_3ZWQD46CDY=GS1.2.1703045671.1.0.1703045671.0.0.0; _ga=GA1.1.251547426.1687321142; _ga_S49B01GLF1=GS1.1.1703045769.1.1.1703045818.0.0.0; _ga_DHKKCHMQNH=GS1.1.1703045649.2.1.1703046393.0.0.0; __cf_bm=UqKaKrqH8nO6i4Idlng.yMOVFkZCse4i.koNTdV9scA-1703046708-1-AeyKk+Rr2BPbsB+Yht0W0DvG9p16HjJDpSSuiz91uUrhxqzfQ1Ak81duILl/uoHNPjtSFv9979xB/A5k6I7HWa4=; _ga_EY2MYK54PW=GS1.1.1703046708.16.1.1703046711.0.0.0",
    },
    "method": "GET"
  })
  .then(r => r.text())
  .then(r => r.split("\n").map(l => l.split(",")))
  .then(f => [f[0], ...f.filter(filer => filer[7] === '"Saratoga"')])
  .then(f => `<body><table><tbody>${f.map(filer =>
    '<tr>' + filer.map(filerData =>
      '<td>' + filerData + '</td>').join('') +
    '</tr>').join('')}</tbody></table></body>`)
  .then(f => writeFile('campaign-filers-today.html', f));
};

const getLegislationGov = () => {
  getLegislationWithStatus('DELIVERED_TO_GOV')
    .then(bills => bills.map(b => [
      b.status.statusDesc,
      b.actions.items.slice(-1)[0].date,
      b.sponsor.member.shortName,
      b.basePrintNo,
      b.title
    ]))
    .then((bills) => writeFile('leg-gov.html', `<body><h4>D2G</h4><ol>${bills.map(b => `<li>${b.join(" — ")}</li>`).join('')}</ol></body>`));
};

const getLegislationPassed = () => {
  Promise.all([getLegislationWithStatus('PASSED_ASSEMBLY'), getLegislationWithStatus('PASSED_SENATE')])
    .then((bills) => Promise.resolve(bills.flat()))
    .then(bills => bills.filter(b => ['RETURNED TO ASSEMBLY', 'RETURNED TO SENATE'].includes(b.actions.items.slice(-1)[0].text)))
    .then(bills => bills.map(b => [
      b.status.statusDesc,
      b.actions.items.slice(-1)[0].date,
      b.sponsor.member.shortName,
      b.basePrintNo,
      b.title
    ]))
    .then((bills) => writeFile('leg-passed.html', `<body><h4>Awaiting D2G</h4><ol>${bills.map(b => `<li>${b.join(" — ")}</li>`).join('')}</ol></body>`));
};

const getOCWAMeetings = () => {
  fetch("https://go.boarddocs.com/ny/ocwa/Board.nsf/BD-GetMeetingsList?open&0.9541476706708205", {
    "body": "current_committee_id=A9QN5Z5E5509",
    "method": "POST"
  })
  .then(r => r.json())
  .then(r => r.map(meeting => `${meeting.numberdate} ${meeting.name}`))
  .then(m => writeFile('ocwa-meetings.html', `<body>${m.join("\n")}</body>`));
};

const getOCSSCAppearances = () => {
  const justiceIds = [
    'U6a2jpnVoDhKwKshKSJodA==', // Antonacci
    '54p3E0aAR5yUTR2DF04l6w==', // Fogel
    'Pjje_PLUS_SvP9MR72jp7clt6tg==', // Kuehner
    'ceb4ZFI6r4j6KBHo6lq2GA==', // Lamendola
    '8GuZG2mzpD1uh4iWfuFf3w==', // McMahon
    'QcTMuZwDgYYoZUdJeafHBQ==', // Neri
    'yz6lym9RMdSn7xohHv_PLUS_3Og==' // Westlake
  ];

  const baseUrl = 'https://iapps.courts.state.ny.us/webcivil/FCASCalendarDetail?hInclude=NO&hSort=index_no&hiddenOutputFormat=HTML&search=Judge';
  const courtId = 'JgLFm8QprqfximG8E2BCwA==';
  const today = (new Date()).toLocaleDateString();
  console.log((new Date()).toLocaleString())

  return Promise.all(justiceIds.map((justiceId) => {
    let extraParams = `court=${courtId}&justice=${justiceId}&hiddenDateFrom=${today}&hiddenDateTo=${today}`;

    return fetch(`${baseUrl}&${extraParams}`)
      .then(r => r.text())
      .then(r => new Promise((resolve) => resolve(cheerio.load(r))))
      .then(r => {
        if (r('dl').length === 0) return Promise.resolve([]);

        return Promise.resolve(Array.from(r('dl')).map((app) => [
          // Case number and caption
          r(app.childNodes.find(c => c.name === 'dt')).text().trim().replace('-\n', '- '),

          // Case details
          ...app.childNodes.filter(c => c.name === 'dd').map(c => r(c).text().trim().replace(':\n', ': ').replace('\n/', ','))
        ]));
      });
  }))
    .then((apps) => writeFile('ocssc-today.html', `<body>${apps.flat().map(app => app.join("\n")).join("\n\n")}</body>`));
};

const getUnfitCityStructures = () => {
  const params = new URLSearchParams({
    'f': 'json',
    'orderByFields': 'violation_date',
    'outFields': '*',
    'where': `(
      violation IN ('2020 PMCNYS - Section 107.1.3 - Structure Unfit for Human Occupancy')
      AND status_type_name IN ('Open'))`
  });

  return fetch(
    `https://services6.arcgis.com/bdPqSfflsdgFRVVM/arcgis/rest/services/Code_Violations_v2/FeatureServer/0/query?${params.toString()}`
    )
  .then(r => r.json())
  .then(r => r.features.map(p => [
    p.attributes.complaint_address,
    p.attributes.SBL,
    new Date(p.attributes.violation_date).toLocaleDateString(),
    p.attributes.owner_name
  ]))
  .then((properties) => Array.from(new Set(properties.reverse().map(p => p.join(" | ")))))
  .then((properties) => writeFile('citycodes-unfit.html', `<body>${properties.join("\n")}</body>`));
};

[
  //getCampaignFilersToday,
  getLegislationGov,
  getLegislationPassed,
  getOCWAMeetings,
  // getOCSSCAppearances,
  getUnfitCityStructures
].forEach(fn => fn());
