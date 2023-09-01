import { browser } from '$app/environment';
import NDK, { NDKEvent, NDKNip07Signer } from '@nostr-dev-kit/ndk';
import { writable, type Writable } from 'svelte/store';
import { standardRelays } from './consts';

const relays = JSON.parse(browser && localStorage.getItem("wikinostr_relays") || JSON.stringify(standardRelays));
const Ndk: NDK = new NDK({explicitRelayUrls: relays});
Ndk.connect().then(() => console.log("ndk connected"));
export const ndk: Writable<NDK> = writable(Ndk);

// if (browser) {
//     const relays = JSON.parse(localStorage.getItem("wikinostr_relays") || JSON.stringify(standardRelays));
//     const useNip07Signer = JSON.parse(localStorage.getItem("wikinostr_usenip07") || 'false');

//     try {
//         if (useNip07Signer) {
//             ndk = new NDK({
//                 explicitRelayUrls: relays,
//                 signer: new NDKNip07Signer(),
//             });
//         } else {
//             ndk = new NDK({
//                 explicitRelayUrls: relays,
//             });
//         }
//     } catch (error) {
//         alert('error: ' + error);
//     }
// }
