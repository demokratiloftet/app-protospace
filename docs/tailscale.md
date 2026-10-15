# Accessing the shared demo environment

Tailscale is needed only for the shared hackathon apps and test PDS. It is not needed to develop locally or connect to a public PDS.

1. Ask Edvin for access to the hackathon Tailscale network and the app or test-account details you need.
2. Install Tailscale, sign in and connect to that network.
3. Open the shared app link, or configure the test PDS in the [PDS guide](integrations.md).

If a shared link times out, check that Tailscale is connected to the correct network. If you see a 502 response or a certificate error, share the URL and error with Edvin. Do not disable certificate verification.

Network access and an account are separate: connecting Tailscale does not create a PDS account or sign you into an app.
