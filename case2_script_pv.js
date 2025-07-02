setTimeout(async () => {
  let ipUa;
  const ipUaName = 'aidp_tt_ip_ua';
  let vidPVCount;
  const ipUaCountName = 'aidp_tt_ip_uaPVCount';
  const vidPVCountName = 'aidp_tt_vidPVCount';

  let sCookievidPVCountVal;
  let sCookieckipUaPVCountVal;
  let ipUaPVCount;

  try {
    ipUa = (await window.adenty.scookie.get(ipUaName))?.value;

    vidPVCount = await window.adenty?.scookie.get(vidPVCountName);
    sCookievidPVCountVal = Number(vidPVCount.value);

    ipUaPVCount = await window.adenty?.scookie.get(ipUaCountName);
    sCookieckipUaPVCountVal = Number(ipUaPVCount.value);
  } catch (e) {
    ipUa = null;
    vidPVCount = null;
    sCookievidPVCountVal = null;
    ipUaPVCount = null;
    sCookieckipUaPVCountVal = null;
  }

  const date = new Date();
  date.setMonth(date.getMonth() + 1);

  let browserData;
  try {
    browserData = JSON.parse(await adenty.astorage.get('aidpbr'))?.value;
  } catch (error) {
    browserData = null;
  }
  const ipUaData = JSON.stringify({
    ip: adenty.dl?.adenty?.visit?.ipsha,
    ua: browserData
  })
  window.adenty.scookie.set({
    name: vidPVCountName,
    value: JSON.stringify((sCookievidPVCountVal ? sCookievidPVCountVal + 1 : 1)),
    expires: date.toISOString(),
  });
  debugger
  if (!sCookieckipUaPVCountVal || !ipUa) {
    debugger
    window.adenty.scookie.set({
      name: ipUaCountName,
      value: JSON.stringify(1),
      expires: date.toISOString(),
    });
    window.adenty.scookie.set({
      name: ipUaName,
      value: ipUaData,
      expires: date.toISOString(),
    });
    return;
  }

  let newIpUaCountValue;
  if (ipUa.ip !== adenty.dl?.adenty?.visit?.ipsha || ipUa.ua !== browserData) {
    window.adenty.event.fireEvent({
      name: 'VisitorIpUaCountChanged',
      eventArguments: JSON.stringify({[ipUaCountName]: sCookieckipUaPVCountVal, [ipUaName]: ipUaData})
    });

    newIpUaCountValue = 1;
    window.adenty.scookie.set({
      name: ipUaName,
      value: ipUaData,
      expires: date.toISOString(),
    });
  } else {
    newIpUaCountValue = sCookieckipUaPVCountVal + 1
  }

  window.adenty.scookie.set({
    name: ipUaCountName,
    value: JSON.stringify(newIpUaCountValue),
    expires: date.toISOString(),
  });
}, 0);
