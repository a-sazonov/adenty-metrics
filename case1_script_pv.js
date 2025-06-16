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
      purgeDate: date.toISOString()
    });
    document.cookie = `${cGUID}=${scGUID.value}; expires=${date.toUTCString()};`;
    debugger
    return;
  }

  const cGUID = 'aidp_tt_cookieId';
  const cGUIDKey = `${cGUID}=`;
  const cookie = document.cookie.split(';');
  cookie.forEach(item => {
    let val;
    if (item.indexOf(cGUIDKey) > -1) {
      val = (item.trim().substring(cGUIDKey.length) || '');
    }
    debugger
    if (!val || val !== scGUID.value) {
      window.adenty.event.fireServerEvent({name: 'VisitorCookieChanged'});
      document.cookie = `${cGUID}=${scGUID.value}; expires=${date.toUTCString()};`;
    }
  });
}, 0)