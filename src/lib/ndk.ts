import { browser } from '$app/environment';
import NDK, { NDKEvent, NDKNip07Signer } from '@nostr-dev-kit/ndk';
import { standardRelays } from './consts';

export let ndk: NDK | undefined = undefined;

if (browser) {
    const relays = JSON.parse(localStorage.getItem("wikinostr_relays") || JSON.stringify(standardRelays));
    const useNip07Signer = JSON.parse(localStorage.getItem("wikinostr_usenip07") || 'false');

    try {
        if (useNip07Signer) {
            ndk = new NDK({
                explicitRelayUrls: relays,
                signer: new NDKNip07Signer(),
            });
        } else {
            ndk = new NDK({
                explicitRelayUrls: relays,
            });
        }
    } catch (error) {
        alert('error: ' + error);
    }
}
