setTimeout(async () => {
  let scGUID;
  try {
    scGUID = (await window.adenty?.scookie.get('aidp_tt_cookieId'))?.value;
  } catch (e) {
    scGUID = null;
  }

  const date = new Date();
  date.setMonth(date.getMonth() + 1);

  if (!scGUID) {
    const array = new Uint8Array(8);
    crypto.getRandomValues(array);
    const shortToken = Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    window.adenty.scookie.set({
      name: 'aidp_tt_cookieId',
      value: shortToken,
      expires: date.toISOString(),
    });
    document.cookie = `${cGUID}=${scGUID}; expires=${date.toUTCString()};`;
    debugger
    return;
  }

  const cGUID = 'aidp_tt_cookieId';
  const cGUIDKey = `${cGUID}=`;
  const cookie = document.cookie.split(';');
  const cookieVal = cookie.find(item => {
    return item.indexOf(cGUIDKey) > -1
  });
  const val = cookieVal ? (cookieVal.trim().substring(cGUIDKey.length) || '') : '';
  debugger
  if (!val || val !== scGUID) {
    //window.adenty.event.fireEvent({name: 'VisitorCookieChanged'}); for 1.7 only
    triggerEvent({name: 'VisitorCookieChanged'});
    document.cookie = `${cGUID}=${scGUID}; expires=${date.toUTCString()};`;
  }
}, 0)

async function triggerEvent() {
  let visitor;
  try {
    const data = (await adenty.astorage.get('aidpvid'), true)?.value;
debugger
    visitor = JSON.parse(data);
  } catch (e) {
    visitor = null
  }

  if (!visitor) {
    return;
  }

  const browserName = visitor?.deviceDetail?.browser?.name;
  const eventModel = {
    tenants: {
      clientCode: adenty.dl?.adenty?.visit?.clientcode,
      propertyCode: adenty.dl?.adenty?.visit?.sitegroupcode,
      siteCode: adenty.dl?.adenty?.visit?.string,
    },
    event: 14,
    eventName: event.name,
    visitorId: adenty.dl.adenty?.visit?.vid,
    recognitionId: adenty.dl.adenty?.visit?.rid,
    activityData: event.eventArguments,
    deviceDetail: visitor?.deviceDetail,
  };
  const url = 'https://prod-adenty-proxy-api.azurewebsites.net/api/deviceVisitorActivity/event';
  if (navigator.sendBeacon && (browserName !== BrowserConstants.Brave && browserName !== BrowserConstants.Tor)) {
    sendBeaconEvent(url, eventModel, browser);
  } else {
    sendFetchEvent(url, eventModel, browser);
  }
}

function sendBeaconEvent(url, eventModel) {
  navigator.sendBeacon(url, eventModel);
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