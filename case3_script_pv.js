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
    fp = await window.adenty.scookie.get(fpName);
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
  cookie.forEach(item => {
    let val;
    if (item.indexOf(ckPVCountCookiName) > -1) {
      try {
        val = (item.trim().substring(ckPVCountCookiName.length) || '');
      } catch (e) {
        val = null;
      }
    }

    if (!val || val !== ckPVCount.value) {
      const expires = date.toUTCString();
      window.adenty.event.fireServerEvent({name: 'VisitorCookieCountChanged', eventArguments: {[ckPVCountName]: ckPVCount}});

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
  });

  if (fp?.value !== adenty.dl.adenty?.visit?.rid) {
    window.adenty.event.fireServerEvent({name: 'VisitorFPCountChanged', eventArguments: {[fpPVCountName]: fpPVCount}});

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
}, 0)