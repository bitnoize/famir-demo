
async function setupTest(campaignId, mirrorDomain) {
  if (!campaignId || !mirrorDomain) {
    throw new Error(`Missing params`)
  }

  const lockCode = await famir.createCampaign({
    campaignId,
    mirrorDomain,
  })

  await famir.updateCampaign({
    campaignId,
    description: 'Testing mirrors',
    lockCode,
  })

  await famir.createProxy({
    campaignId,
    proxyId: 'default',
    url: 'http://127.0.0.1:8080',
    lockCode,
  })

  await famir.enableProxy({
    campaignId,
    proxyId: 'default',
    lockCode,
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
    lockCode,
  })

  await famir.appendTargetLabel({
    campaignId,
    targetId: 'httpbin',
    label: 'httpbin',
    lockCode,
  })

  await famir.enableTarget({
    campaignId,
    targetId: 'httpbin',
    lockCode,
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
    lockCode,
  })

  await famir.appendTargetLabel({
    campaignId,
    targetId: 'browserleaks',
    label: 'browserleaks',
    lockCode,
  })

  await famir.enableTarget({
    campaignId,
    targetId: 'browserleaks',
    lockCode
  })

  // ...

  await famir.unlockCampaign({
    campaignId,
    lockCode
  })
}
