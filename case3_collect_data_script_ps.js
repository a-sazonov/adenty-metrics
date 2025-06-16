setTimeout(async () => {
  let ckPVCount;
  const ckPVCountName = 'aidp_tt_ckPVCount';
  let fpPVCount;
  const fpPVCountName = 'aidp_tt_fpPVCount';

  try {
    ckPVCount = await window.adenty?.scookie.get(ckPVCountName);
    fpPVCount = await window.adenty?.scookie.get(fpPVCountName);
  } catch (e) {
    ckPVCount = null;
    fpPVCount = null;
  }

  if (ckPVCount && fpPVCount) {
    window.adenty.event.fireServerEvent({name: 'ck_fp_pv_count', eventArguments: {[ckPVCountName]: ckPVCount, [fpPVCountName]: fpPVCount}});
  }
}, 1000)