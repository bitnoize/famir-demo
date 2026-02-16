async function setupBrowserleaks(campaignId, mirrorDomain) {
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
    description: 'Browserleaks mirror',
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

  // browserleaks

  await famir.createTarget({
    campaignId,
    targetId: 'root',
    isLanding: false,
    donorSecure: true,
    donorSub: '.',
    donorDomain: 'browserleaks.com',
    donorPort: 443,
    mirrorSecure: false,
    mirrorSub: 'browserleaks',
    mirrorPort: 3080,
    lockSecret,
  })

  await famir.appendTargetLabel({
    campaignId,
    targetId: 'root',
    label: 'browserleaks',
    lockSecret,
  })

  await famir.enableTarget({
    campaignId,
    targetId: 'root',
    lockSecret
  })

  // ipv6.browserleaks

  await famir.createTarget({
    campaignId,
    targetId: 'ipv6',
    isLanding: false,
    donorSecure: true,
    donorSub: 'ipv6',
    donorDomain: 'browserleaks.com',
    donorPort: 443,
    mirrorSecure: false,
    mirrorSub: 'ipv6.browserleaks',
    mirrorPort: 3080,
    lockSecret,
  })

  await famir.enableTarget({
    campaignId,
    targetId: 'ipv6',
    lockSecret
  })

  // tls.browserleaks

  await famir.createTarget({
    campaignId,
    targetId: 'tls',
    isLanding: false,
    donorSecure: true,
    donorSub: 'tls',
    donorDomain: 'browserleaks.com',
    donorPort: 443,
    mirrorSecure: false,
    mirrorSub: 'tls.browserleaks',
    mirrorPort: 3080,
    lockSecret,
  })

  await famir.enableTarget({
    campaignId,
    targetId: 'tls',
    lockSecret
  })

  // tls10.browserleaks

  await famir.createTarget({
    campaignId,
    targetId: 'tls10',
    isLanding: false,
    donorSecure: true,
    donorSub: 'tls10',
    donorDomain: 'browserleaks.com',
    donorPort: 443,
    mirrorSecure: false,
    mirrorSub: 'tls10.browserleaks',
    mirrorPort: 3080,
    lockSecret,
  })

  await famir.enableTarget({
    campaignId,
    targetId: 'tls10',
    lockSecret
  })

  // tls11.browserleaks

  await famir.createTarget({
    campaignId,
    targetId: 'tls11',
    isLanding: false,
    donorSecure: true,
    donorSub: 'tls11',
    donorDomain: 'browserleaks.com',
    donorPort: 443,
    mirrorSecure: false,
    mirrorSub: 'tls11.browserleaks',
    mirrorPort: 3080,
    lockSecret,
  })

  await famir.enableTarget({
    campaignId,
    targetId: 'tls11',
    lockSecret
  })

  // tls12.browserleaks

  await famir.createTarget({
    campaignId,
    targetId: 'tls12',
    isLanding: false,
    donorSecure: true,
    donorSub: 'tls12',
    donorDomain: 'browserleaks.com',
    donorPort: 443,
    mirrorSecure: false,
    mirrorSub: 'tls12.browserleaks',
    mirrorPort: 3080,
    lockSecret,
  })

  await famir.enableTarget({
    campaignId,
    targetId: 'tls12',
    lockSecret
  })

  // tls13.browserleaks

  await famir.createTarget({
    campaignId,
    targetId: 'tls13',
    isLanding: false,
    donorSecure: true,
    donorSub: 'tls13',
    donorDomain: 'browserleaks.com',
    donorPort: 443,
    mirrorSecure: false,
    mirrorSub: 'tls13.browserleaks',
    mirrorPort: 3080,
    lockSecret,
  })

  await famir.enableTarget({
    campaignId,
    targetId: 'tls13',
    lockSecret
  })

  // mixed.browserleaks

  await famir.createTarget({
    campaignId,
    targetId: 'mixed',
    isLanding: false,
    donorSecure: true,
    donorSub: 'mixed',
    donorDomain: 'browserleaks.org',
    donorPort: 443,
    mirrorSecure: false,
    mirrorSub: 'mixed.browserleaks',
    mirrorPort: 3080,
    lockSecret,
  })

  await famir.enableTarget({
    campaignId,
    targetId: 'mixed',
    lockSecret
  })

  // permissions.browserleaks

  await famir.createTarget({
    campaignId,
    targetId: 'permissions',
    isLanding: false,
    donorSecure: true,
    donorSub: 'permissions',
    donorDomain: 'browserleaks.org',
    donorPort: 443,
    mirrorSecure: false,
    mirrorSub: 'permissions.browserleaks',
    mirrorPort: 3080,
    lockSecret,
  })

  await famir.enableTarget({
    campaignId,
    targetId: 'permissions',
    lockSecret
  })

  // ...

  await famir.unlockCampaign({
    campaignId,
    lockSecret
  })
}
