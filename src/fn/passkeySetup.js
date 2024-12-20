import domainGetter from './domainGetter';
import { startAuthentication, startRegistration } from '@simplewebauthn/browser';

async function isPasskeySupported() {
	if (
		window.PublicKeyCredential &&
		PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable &&
		PublicKeyCredential.isConditionalMediationAvailable
	) {
		// Check if user verifying platform authenticator is available.
		return Promise.all([
			PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable(),
			PublicKeyCredential.isConditionalMediationAvailable()
		])
			.then((results) => {
				return results.every((r) => r === true);
			})
			.catch((e) => {
				return false;
			});
	}
}

async function passkeySetup(additionalBody, onSuccess, onError) {
	if (additionalBody === undefined || onSuccess === undefined || onError === undefined) return;
	const hasPasskeySupport = await isPasskeySupported();
	console.log(hasPasskeySupport);
	let regResponse;
	let response = await (
		await fetch(domainGetter('/auth/authnRegisterStart'), {
			credentials: 'include',
			method: 'POST',
			body: JSON.stringify({ ...additionalBody })
		})
	).json();
	if (
		response.error === undefined &&
		response.opts !== undefined &&
		response.regsID !== undefined
	) {
		regResponse = await startRegistration(response.opts);
		fetch(domainGetter('/auth/authnRegisterVerify'), {
			method: 'POST',
			credentials: 'include',
			body: JSON.stringify({ regs: regResponse, regsID: response.regsID })
		})
			.then(async (res) => {
				let resx = await res.json();
				if (resx.status === 'Failed') {
					onError.apply(null, []);
				} else {
					onSuccess.apply(null, []);
				}
			})
			.catch((e) => {
				onError.apply(null, [e]);
				console.log(e);
			});
	}
}

async function passkeyAuth(additionalBody, onError, onSuccess, onWaitingKey, onKeyFailed, onKeySuccess) {
	if (additionalBody === undefined) return;
	let response = await (
		await fetch(domainGetter('/auth/authnAuthenticationStart'), {
			credentials: 'include',
			method: 'POST',
			body: JSON.stringify({ ...additionalBody })
		})
	).json();
	if (
		response.error === undefined &&
		response.opts !== undefined &&
		response.regsID !== undefined
	) {
		onWaitingKey.apply(null, []);
		try {
			let authResponse = await startAuthentication(response.opts);
			fetch(domainGetter('/auth/authnAuthenticationVerify'), {
				method: 'POST',
				credentials: 'include',
				body: JSON.stringify({ regs: authResponse, regsID: response.regsID })
			})
				.then(async (res) => {
					let resx = await res.json();
					if (resx.status === 'Failed') {
						onError.apply(null, []);
					} else {
						onKeySuccess.apply(null, []);
					}
				})
				.catch((e) => {
					onError.apply(null, [e]);
					console.log(e);
				});
		} catch (e) {
			onKeyFailed.apply(null, [e]);
		}

	} else {
		onError.apply(null, []);
	}
}

export { passkeySetup, passkeyAuth };
