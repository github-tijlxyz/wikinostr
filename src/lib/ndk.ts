import { browser } from '$app/environment';
import NDK, { NDKEvent, NDKNip07Signer } from '@nostr-dev-kit/ndk';

export let ndk: NDK | undefined = undefined;

const someRelays = ["wss://nos.lol", "wss://relay.damus.io", "wss://relay.snort.social"]

if (browser) {
    let signer = undefined;
    try {
        signer = new NDKNip07Signer();
    } catch (error) {
        console.log("error starting nip07 signer", error)
    }
    if (signer) {
        ndk = new NDK({
            explicitRelayUrls: someRelays,
            signer: signer,
        });
    } else {
        ndk = new NDK({
            explicitRelayUrls: someRelays,
        });
    }
}

