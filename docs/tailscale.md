# Accessing the shared demo environment

Tailscale is needed for the shared hackathon test PDS and apps explicitly shared as private. Public app websites, the local sandbox and public PDS providers do not require it.

1. Ask Edvin for access to the hackathon Tailscale network and the app or test-account details you need.
2. Install Tailscale, sign in and connect to that network.
3. Open the private app link you were given, or configure the test PDS in the [PDS guide](integrations.md).

If a private link times out, check that Tailscale is connected to the correct network. If you see a 502 response or a certificate error, share the URL and error with Edvin. Do not disable certificate verification.

Network access and an account are separate: connecting Tailscale does not create a PDS account or sign you into an app.
