
async function setupTest(campaignId, mirrorDomain) {
  if (!campaignId || !mirrorDomain) {
    throw new Error(`Missing params`)
  }

  await famir.createCampaign({
    campaignId,
    mirrorDomain,
    //lockTimeout: 60 * 1000
  })

  const lockSecret = await famir.lockCampaign({
    campaignId,
  })

  await famir.updateCampaign({
    campaignId,
    description: 'Testing mirrors',
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

  // httpbin

  await famir.createTarget({
    campaignId,
    targetId: 'httpbin',
    isLanding: false,
    donorSecure: true,
    donorSub: '.',
    donorDomain: 'httpbin.org',
    donorPort: 443,
    mirrorSecure: false,
    mirrorSub: 'httpbin',
    mirrorPort: 8000,
    lockSecret,
  })

  await famir.appendTargetLabel({
    campaignId,
    targetId: 'httpbin',
    label: 'httpbin',
    lockSecret,
  })

  await famir.enableTarget({
    campaignId,
    targetId: 'httpbin',
    lockSecret,
  })

  // browserleaks

  await famir.createTarget({
    campaignId,
    targetId: 'browserleaks',
    isLanding: false,
    donorSecure: true,
    donorSub: '.',
    donorDomain: 'browserleaks.com',
    donorPort: 443,
    mirrorSecure: false,
    mirrorSub: 'browserleaks',
    mirrorPort: 8000,
    lockSecret,
  })

  await famir.appendTargetLabel({
    campaignId,
    targetId: 'browserleaks',
    label: 'browserleaks',
    lockSecret,
  })

  await famir.enableTarget({
    campaignId,
    targetId: 'browserleaks',
    lockSecret
  })

  // ...

  await famir.unlockCampaign({
    campaignId,
    lockSecret
  })
}
