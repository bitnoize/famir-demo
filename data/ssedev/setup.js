async function setup(campaignId, mirrorDomain) {
  if (!campaignId || !mirrorDomain) {
    throw new Error(`Missing params`)
  }

  await famir.createCampaign({
    campaignId,
    mirrorDomain,
  })

  const lockSecret = await famir.lockCampaign({
    campaignId,
  })

  await famir.updateCampaign({
    campaignId,
    description: 'Ssedev mirror',
    lockSecret,
  })

  await famir.createProxy({
    campaignId,
    proxyId: 'default',
    url: 'http://127.0.0.1:8080',
    lockSecret,
  })

  await famir.enableProxy({
    campaignId,
    proxyId: 'default',
    lockSecret,
  })

  // root

  await famir.createTarget({
    campaignId,
    targetId: 'root',
    isLanding: false,
    donorSecure: true,
    donorSub: '.',
    donorDomain: 'sse.dev',
    donorPort: 443,
    mirrorSecure: false,
    mirrorSub: '.',
    mirrorPort: 3080,
    lockSecret,
  })

  await famir.appendTargetLabel({
    campaignId,
    targetId: 'root',
    label: 'ssedev',
    lockSecret,
  })

  await famir.enableTarget({
    campaignId,
    targetId: 'root',
    lockSecret,
  })

  await famir.unlockCampaign({
    campaignId,
    lockSecret
  })
}
