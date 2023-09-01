import { browser } from '$app/environment';
import NDK, { NDKEvent, NDKNip07Signer } from '@nostr-dev-kit/ndk';
import { writable, type Writable } from 'svelte/store';
import { standardRelays } from './consts';

const relays = JSON.parse(browser && localStorage.getItem("wikinostr_relays") || JSON.stringify(standardRelays));
const Ndk: NDK = new NDK({ explicitRelayUrls: relays });
Ndk.connect().then(() => console.log("ndk connected"));
export const ndk: Writable<NDK> = writable(Ndk);
