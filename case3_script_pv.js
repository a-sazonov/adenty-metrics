setTimeout(async () => {
  let fp;
  const fpName = 'aidp_tt_fp';
  let vidPVCount;
  const vidPVCountName = 'aidp_tt_vidPVCount';
  let ckPVCount;
  const ckPVCountName = 'aidp_tt_ckPVCount';
  let fpPVCount;
  const fpPVCountName = 'aidp_tt_fpPVCount';
  let sCookieckPVCountVal;
  let sCookiefpPVCountVal;
  let sCookievidPVCountVal;

  try {
    fp = (await window.adenty.scookie.get(fpName))?.value;

    vidPVCount = await window.adenty?.scookie.get(vidPVCountName);
    sCookievidPVCountVal = Number(vidPVCount.value);

    ckPVCount = await window.adenty?.scookie.get(ckPVCountName);
    sCookieckPVCountVal = Number(ckPVCount.value);

    fpPVCount = await window.adenty?.scookie.get(fpPVCountName);
    sCookiefpPVCountVal = Number(fpPVCount.value);
  } catch (e) {
    fp = null;
    ckPVCount = null;
    sCookieckPVCountVal = null;
    fpPVCount = null;
    sCookiefpPVCountVal = null;
  }

  const date = new Date();
  date.setMonth(date.getMonth() + 1);

  window.adenty.scookie.set({
    name: vidPVCountName,
    value: JSON.stringify((sCookievidPVCountVal ? sCookievidPVCountVal + 1 : 1)),
    expires: date.toISOString(),
  });

  if (!sCookieckPVCountVal || !sCookiefpPVCountVal || !fp) {
    document.cookie = `${ckPVCountName}=1; expires=${date.toUTCString()};`;
    window.adenty.scookie.set({
      name: ckPVCountName,
      value: JSON.stringify(1),
      expires: date.toISOString(),
    });
    window.adenty.scookie.set({
      name: fpPVCountName,
      value: JSON.stringify(1),
      expires: date.toISOString(),
    });
    window.adenty.scookie.set({
      name: fpName,
      value: adenty.dl.adenty?.visit?.rid,
      expires: date.toISOString(),
    });
    return;
  }

  const ckPVCountCookiName = `${ckPVCountName}=`;
  const cookie = document.cookie.split(';');
  const cookieVal = cookie.find(item => {
    return item.indexOf(ckPVCountCookiName) > -1
  });
  const val = cookieVal ? (cookieVal.trim().substring(ckPVCountCookiName.length) || '') : '';
  const expires = date.toUTCString();
  let newCkCounVal;
  if (!val || Number(val) !== sCookieckPVCountVal) {
    newCkCounVal = 1;
    // window.adenty.event.fireEvent({name: 'VisitorCookieCountChanged', eventArguments: {[ckPVCountName]: ckPVCount}}); //for 1.7 only
    triggerEvent({name: 'VisitorCookieCountChanged', eventArguments: {[ckPVCountName]: sCookieckPVCountVal}});
  } else {
    newCkCounVal = sCookieckPVCountVal + 1;
  }

  window.adenty.scookie.set({
    name: ckPVCountName,
    value: JSON.stringify(newCkCounVal),
    expires: date.toISOString(),
  });
  document.cookie = `${ckPVCountName}=${newCkCounVal}; expires=${date.toUTCString()};`;

  let newFpCountValue;
  if (fp !== adenty.dl?.adenty?.visit?.rid) {
    //window.adenty.event.fireEvent({name: 'VisitorFPCountChanged', eventArguments: {[fpPVCountName]: fpPVCount}}); //for 1.7 only
    triggerEvent({name: 'VisitorFPCountChanged', eventArguments: {[fpPVCountName]: sCookiefpPVCountVal}});

    newFpCountValue = 1;
    window.adenty.scookie.set({
      name: fpName,
      value: adenty.dl.adenty?.visit?.rid,
      expires: date.toISOString(),
    });
  } else {
    newFpCountValue = sCookiefpPVCountVal + 1
  }

  window.adenty.scookie.set({
    name: fpPVCountName,
    value: JSON.stringify(newFpCountValue),
    expires: date.toISOString(),
  });
}, 0);

async function triggerEvent(event) {
  const eventModel = {
    tenants: {
      clientCode: adenty.dl?.adenty?.visit?.clientcode,
      propertyCode: adenty.dl?.adenty?.visit?.sitegroupcode,
      siteCode: adenty.dl?.adenty?.visit?.sitecode,
    },
    event: 14,
    eventName: event.name,
    visitorId: adenty.dl.adenty?.visit?.vid,
    recognitionId: adenty.dl.adenty?.visit?.rid,
    activityData: JSON.stringify(event.eventArguments) || null,
  };
  const url = 'https://prod-adenty-proxy-api.azurewebsites.net/api/deviceVisitorActivity/event';
  if (navigator.sendBeacon) {
    sendBeaconEvent(url, eventModel);
  } else {
    sendFetchEvent(url, eventModel);
  }
}

function sendBeaconEvent(url, eventModel) {
  navigator.sendBeacon(url, JSON.stringify(eventModel));
}

function sendFetchEvent(url, eventModel) {
  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: eventModel
  })
}