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

  // root

  await famir.createTarget({
    campaignId,
    targetId: 'root',
    isLanding: false,
    donorSecure: true,
    donorSub: '.',
    donorDomain: 'browserleaks.com',
    donorPort: 443,
    mirrorSecure: false,
    mirrorSub: '.',
    mirrorPort: 3080,
    connectTimeout: 5000,
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

  // comments

  await famir.createTarget({
    campaignId,
    targetId: 'comments',
    isLanding: false,
    donorSecure: true,
    donorSub: 'comments',
    donorDomain: 'browserleaks.com',
    donorPort: 443,
    mirrorSecure: false,
    mirrorSub: 'comments',
    mirrorPort: 3080,
    connectTimeout: 5000,
    lockSecret,
  })

  await famir.enableTarget({
    campaignId,
    targetId: 'comments',
    lockSecret
  })

  // ipv6

  await famir.createTarget({
    campaignId,
    targetId: 'ipv6',
    isLanding: false,
    donorSecure: true,
    donorSub: 'ipv6',
    donorDomain: 'browserleaks.com',
    donorPort: 443,
    mirrorSecure: false,
    mirrorSub: 'ipv6',
    mirrorPort: 3080,
    connectTimeout: 5000,
    lockSecret,
  })

  await famir.enableTarget({
    campaignId,
    targetId: 'ipv6',
    lockSecret
  })

  // tls

  await famir.createTarget({
    campaignId,
    targetId: 'tls',
    isLanding: false,
    donorSecure: true,
    donorSub: 'tls',
    donorDomain: 'browserleaks.com',
    donorPort: 443,
    mirrorSecure: false,
    mirrorSub: 'tls',
    mirrorPort: 3080,
    connectTimeout: 5000,
    lockSecret,
  })

  await famir.enableTarget({
    campaignId,
    targetId: 'tls',
    lockSecret
  })

  // tls10

  await famir.createTarget({
    campaignId,
    targetId: 'tls10',
    isLanding: false,
    donorSecure: true,
    donorSub: 'tls10',
    donorDomain: 'browserleaks.com',
    donorPort: 443,
    mirrorSecure: false,
    mirrorSub: 'tls10',
    mirrorPort: 3080,
    connectTimeout: 5000,
    lockSecret,
  })

  await famir.enableTarget({
    campaignId,
    targetId: 'tls10',
    lockSecret
  })

  // tls11

  await famir.createTarget({
    campaignId,
    targetId: 'tls11',
    isLanding: false,
    donorSecure: true,
    donorSub: 'tls11',
    donorDomain: 'browserleaks.com',
    donorPort: 443,
    mirrorSecure: false,
    mirrorSub: 'tls11',
    mirrorPort: 3080,
    connectTimeout: 5000,
    lockSecret,
  })

  await famir.enableTarget({
    campaignId,
    targetId: 'tls11',
    lockSecret
  })

  // tls12

  await famir.createTarget({
    campaignId,
    targetId: 'tls12',
    isLanding: false,
    donorSecure: true,
    donorSub: 'tls12',
    donorDomain: 'browserleaks.com',
    donorPort: 443,
    mirrorSecure: false,
    mirrorSub: 'tls12',
    mirrorPort: 3080,
    connectTimeout: 5000,
    lockSecret,
  })

  await famir.enableTarget({
    campaignId,
    targetId: 'tls12',
    lockSecret
  })

  // tls13

  await famir.createTarget({
    campaignId,
    targetId: 'tls13',
    isLanding: false,
    donorSecure: true,
    donorSub: 'tls13',
    donorDomain: 'browserleaks.com',
    donorPort: 443,
    mirrorSecure: false,
    mirrorSub: 'tls13',
    mirrorPort: 3080,
    connectTimeout: 5000,
    lockSecret,
  })

  await famir.enableTarget({
    campaignId,
    targetId: 'tls13',
    lockSecret
  })

  // mixed

  await famir.createTarget({
    campaignId,
    targetId: 'mixed',
    isLanding: false,
    donorSecure: true,
    donorSub: 'mixed',
    donorDomain: 'browserleaks.org',
    donorPort: 443,
    mirrorSecure: false,
    mirrorSub: 'mixed',
    mirrorPort: 3080,
    connectTimeout: 5000,
    lockSecret,
  })

  await famir.enableTarget({
    campaignId,
    targetId: 'mixed',
    lockSecret
  })

  // permissions

  await famir.createTarget({
    campaignId,
    targetId: 'permissions',
    isLanding: false,
    donorSecure: true,
    donorSub: 'permissions',
    donorDomain: 'browserleaks.org',
    donorPort: 443,
    mirrorSecure: false,
    mirrorSub: 'permissions',
    mirrorPort: 3080,
    connectTimeout: 5000,
    lockSecret,
  })

  await famir.enableTarget({
    campaignId,
    targetId: 'permissions',
    lockSecret
  })

  // quic

  await famir.createTarget({
    campaignId,
    targetId: 'quic',
    isLanding: false,
    donorSecure: true,
    donorSub: 'quic',
    donorDomain: 'browserleaks.com',
    donorPort: 443,
    mirrorSecure: false,
    mirrorSub: 'quic',
    mirrorPort: 3080,
    connectTimeout: 5000,
    lockSecret,
  })

  await famir.enableTarget({
    campaignId,
    targetId: 'quic',
    lockSecret
  })

  // ...

  await famir.unlockCampaign({
    campaignId,
    lockSecret
  })
}
