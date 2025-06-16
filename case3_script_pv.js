setTimeout(async () => {
  let fp;
  const fpName = 'aidp_tt_fp';
  let ckPVCount;
  const ckPVCountName = 'aidp_tt_ckPVCount';
  let fpPVCount;
  const fpPVCountName = 'aidp_tt_fpPVCount';
  let sCookieckPVCountVal;
  let sCookiefpPVCountVal;

  try {
    debugger
    fp = (await window.adenty.scookie.get(fpName))?.value;
    ckPVCount = await window.adenty?.scookie.get(ckPVCountName);
      sCookieckPVCountVal = Number(ckPVCount.value);

    fpPVCount = await window.adenty?.scookie.get(fpPVCountName);
      sCookiefpPVCountVal = Number(fpPVCount.value);
      debugger
  } catch (e) {
    fp = null;
    ckPVCount = null;
    sCookieckPVCountVal = null;
    fpPVCount = null;
    sCookiefpPVCountVal = null;
  }

  const date = new Date();
  date.setMonth(date.getMonth() + 1);
debugger
  if (!sCookieckPVCountVal || !sCookiefpPVCountVal || !fp) {
    document.cookie = `${ckPVCountName}=1; expires=${date.toUTCString()};`;
    window.adenty.scookie.set({
      name: ckPVCountName,
      value: JSON.stringify(1),
      expires: date.toISOString(),
      purgeDate: date.toISOString()
    });
    window.adenty.scookie.set({
      name: fpPVCountName,
      value: JSON.stringify(1),
      expires: date.toISOString(),
      purgeDate: date.toISOString()
    });
    window.adenty.scookie.set({
      name: fpName,
      value: adenty.dl.adenty?.visit?.rid,
      expires: date.toISOString(),
      purgeDate: date.toISOString()
    });
    return;
  }

  const ckPVCountCookiName = `${ckPVCountName}=`;
  const cookie = document.cookie.split(';');
  const cookieVal = cookie.find(item => {
    return item.indexOf(cGUIDKey) > -1
  });
  const val = cookieVal ? (cookieVal.trim().substring(cGUIDKey.length) || '') : '';
  if (!val || val !== sCookieckPVCountVal) {
    const expires = date.toUTCString();
    // window.adenty.event.fireEvent({name: 'VisitorCookieCountChanged', eventArguments: {[ckPVCountName]: ckPVCount}}); //for 1.7 only
    triggerEvent({name: 'VisitorCookieCountChanged', eventArguments: {[ckPVCountName]: ckPVCount}});

    window.adenty.scookie.set({
      name: ckPVCountName,
      value: JSON.stringify(1),
      expires: date.toISOString(),
      purgeDate: date.toISOString()
    });
    document.cookie = `${ckPVCountCookiName}=${1}; expires=${expires};`;
  } else {
    window.adenty.scookie.set({
      name: ckPVCountName,
      value: JSON.stringify(sCookieckPVCountVal+1),
      expires: date.toISOString(),
      purgeDate: date.toISOString()
    });
    document.cookie = `${ckPVCountCookiName}=${sCookieckPVCountVal+1}; expires=${expires};`;
  }


  if (fp !== adenty.dl?.adenty?.visit?.rid) {
    //window.adenty.event.fireEvent({name: 'VisitorFPCountChanged', eventArguments: {[fpPVCountName]: fpPVCount}}); //for 1.7 only
    triggerEvent({name: 'VisitorFPCountChanged', eventArguments: {[fpPVCountName]: fpPVCount}});

    window.adenty.scookie.set({
      name: fpName,
      value: adenty.dl.adenty?.visit?.rid,
      expires: date.toISOString(),
      purgeDate: date.toISOString()
    });
    window.adenty.scookie.set({
      name: fpPVCountName,
      value: JSON.stringify(1),
      expires: date.toISOString(),
      purgeDate: date.toISOString()
    });
  } else {
    window.adenty.scookie.set({
      name: fpPVCountName,
      value: JSON.stringify(ckPVCount+1),
      expires: date.toISOString(),
      purgeDate: date.toISOString()
    });
  }
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