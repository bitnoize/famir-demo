# Campaigns

A campaign is the top-level container that groups all related
proxies, targets, redirectors, lures, sessions and messages.

```
# Creates the campaign "httpbin" from a "httpbin-local.yaml" template:
.campaign-create -a templates/httpbin-local.yaml httpbin

# Reads the campaign by ID:
.campaign-read httpbin

# Updates the campaign "httpbin" from a "httpbin-local.yaml" template:
.campaign-update -a templates/httpbin-local.yaml httpbin --force

# Deletes the campaign "httpbin" from a "httpbin-local.yaml" template:
.campaign-update -a templates/httpbin-local.yaml httpbin --force

# Show list of all campaigns:
.campaign-list

```

# Proxies

A proxy contains an upstream server that handles outgoing traffic.
Proxies are automatically load-balanced when creating and authorizing sessions.

# Targets

A target contains the configuration that maps a mirror server to a donor server.

# Redirectors

A redirector contains a landing page template and a list of required field names.

# Lures

The lure will be created in a disabled state (`isEnabled = false`).
Use ".lure-enable" to activate it for traffic routing.

# Sessions

A session tracks a user's interaction with the mirror, including
their assigned proxy, upgrade status, and message count.

# Messages

A message contains a complete HTTP request/response transaction for analysis.
Messages are immutable records that capture all details of a processed request.
