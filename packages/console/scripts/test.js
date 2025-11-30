
async function setupTest(campaignId, mirrorDomain) {
  if (!campaignId || !mirrorDomain) {
    throw new Error(`Missing params`)
  }

  await famir.createCampaign({
    campaignId,
    mirrorDomain,
  })

  await famir.updateCampaign({
    campaignId,
    description: 'Testing mirrors',
  })

  await famir.createProxy({
    campaignId,
    proxyId: 'default',
    url: 'http://127.0.0.1:8080',
  })

  await famir.enableProxy({
    campaignId,
    proxyId: 'default',
  })

  await famir.createTarget({
    campaignId,
    targetId: 'echo',
    isLanding: false,
    donorSecure: true,
    donorSub: '.',
    donorDomain: 'httpbin.org',
    donorPort: 443,
    mirrorSecure: false,
    mirrorSub: 'www',
    mirrorPort: 8000
  })

  await famir.appendTargetLabel({
    campaignId,
    targetId: 'echo',
    label: 'httpbin'
  })

  await famir.enableTarget({
    campaignId,
    targetId: 'echo',
  })

  // ...
}

async function cleanTest(campaignId) {
  if (!campaignId) {
    throw new Error(`Missing params`)
  }

  // ...

  await famir.disableTarget({
    campaignId,
    targetId: 'echo',
  })

  await famir.deleteTarget({
    campaignId,
    targetId: 'echo',
  })

  await famir.disableProxy({
    campaignId,
    proxyId: 'default',
  })

  await famir.deleteProxy({
    campaignId,
    targetId: 'default',
  })

  await famir.deleteCampaign({
    campaignId,
  })
}
