setTimeout(async () => {
  let fp;
  const fpName = 'aidipfp';
  let ckPVCount;
  const ckPVCountName = 'aidp_tt_ckPVCount';
  let fpPVCount;
  const fpPVCountName = 'aidp_tt_fpPVCount';

  try {
    fp = await window.adenty.scookie.get(fpName);
    ckPVCount = await window.adenty?.scookie.get(ckPVCountName);
    fpPVCount = await window.adenty?.scookie.get(fpPVCountName);
  } catch (e) {
    fp = null;
    ckPVCount = null;
    fpPVCount = null;
  }

  const date = new Date();
  date.setMonth(date.getMonth() + 1);

  if (!ckPVCount || !fpPVCount || !fp) {
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
  cookie.forEach(item => {
    let val;
    if (item.indexOf(ckPVCountCookiName) > -1) {
      val = (item.trim().substring(ckPVCountCookiName.length) || '');
    }
    if (!val || val !== ckPVCount.value) {
      const expires = date.toUTCString();
      window.adenty.scookie.set({
        name: ckPVCountName,
        value: JSON.stringify(ckPVCount.value+1),
        expires: date.toISOString(),
        purgeDate: date.toISOString()
      });
      document.cookie = `${ckPVCountCookiName}=${ckPVCount.value+1}; expires=${expires};`;
    }
  });

  if (fp?.value !== adenty.dl.adenty?.visit?.rid) {
    window.adenty.scookie.set({
      name: fpName,
      value: adenty.dl.adenty?.visit?.rid,
      expires: date.toISOString(),
      purgeDate: date.toISOString()
    });
    window.adenty.scookie.set({
      name: fpPVCountName,
      value: JSON.stringify(ckPVCount+1),
      expires: date.toISOString(),
      purgeDate: date.toISOString()
    });
  }
}, 0)