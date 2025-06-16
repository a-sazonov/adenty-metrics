setTimeout(async () => {
  let scGUID;
  try {
    scGUID = await window.adenty?.scookie.get('aidpscc');
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
      name: 'aidpscc',
      value: shortToken,
      expires: date.toISOString(),
      purgeDate: date.toISOString()
    });
    document.cookie = `${cGUID}=${scGUID.value}; expires=${date.toUTCString()};`;
    return;
  }

  const cGUID = 'cookieGUID=';
  const cookie = document.cookie.split(';');
  cookie.forEach(item => {
    let val;
    if (item.indexOf(cGUID) > -1) {
      val = (item.trim().substring(cGUID.length) || '');
    }
    if (!val || val !== scGUID.value) {
      window.adenty.event.fireServerEvent({name: 'cookieGUID'});
      document.cookie = `${cGUID}=${scGUID.value}; expires=${date.toUTCString()};`;
    }
  });
}, 0)