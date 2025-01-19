import { atom } from 'jotai';

export const internalWeakSpotAtom = atom(10);
export const weakSpotAtom = atom(
	get => {
		const dodgeOffset = get(dodgeOffsetAtom);
		const weakSpot = get(internalWeakSpotAtom);
		return weakSpot + dodgeOffset;
	},
	(_, set, value: number) => {
		set(internalWeakSpotAtom, value);
	}
);
export const internalACAtom = atom(15);
export const acAtom = atom(
	get => {
		const ac = get(internalACAtom);
		const proficiencyBonus = get(proficiencyBonusAtom);
		const parry = get(parryAtom);
		return parry ? ac + proficiencyBonus : ac;
	},
	(_get, set, value: number) => {
		set(internalACAtom, value);
	}
);

export const hitWindowAtom = atom(get => {
	const weakSpot = get(weakSpotAtom);
	const internalWeakSpot = get(internalWeakSpotAtom);
	const ac = get(acAtom);
	const hitWindowLen = Math.max(20 - ac, 0);
	const rightPadding = hitWindowLen % 2;
	const halfLen = Math.floor(hitWindowLen / 2);
	const internalAc = get(internalACAtom);
	const internalHitWindowLen = Math.max(20 - internalAc, 0);
	const internalRightPadding = internalHitWindowLen % 2;
	const internalHalfLen = Math.floor(internalHitWindowLen / 2);
	return {
		internalHitWindow: {
			start: internalWeakSpot - internalHalfLen,
			end: internalWeakSpot + internalHalfLen + internalRightPadding,
		},
		start: weakSpot - halfLen,
		end: weakSpot + halfLen + rightPadding,
	};
});

export const inHitWindowAtom = atom(get => {
	const range = get(hitWindowAtom);
	return (value: number) => value >= range.start && value <= range.end;
});
export const inInternalHitWindowAtom = atom(get => {
	const range = get(hitWindowAtom);
	return (value: number) =>
		value >= range.internalHitWindow.start &&
		value <= range.internalHitWindow.end;
});
export const avoidedAttackAtom = atom(get => {
	const hitWindow = get(hitWindowAtom);
	const inHitWindow = get(inHitWindowAtom);
	const inInternalHitWindow = get(inInternalHitWindowAtom);
	return (value: number) => {
		const avoid = inInternalHitWindow(value) && !inHitWindow(value);
		return (
			avoid ||
			(value > hitWindow.internalHitWindow.end &&
				value < hitWindow.start) ||
			(value > hitWindow.end && value < hitWindow.internalHitWindow.start)
		);
	};
});

export type DodgeState = 'left' | 'right' | 'disabled';
export const dodgeStateAtom = atom<DodgeState>('disabled');
export const dodgeSignAtom = atom(get => {
	const dodgeState = get(dodgeStateAtom);
	return dodgeState === 'left' ? -1 : dodgeState === 'right' ? 1 : 0;
});
export const dodgeOffsetAtom = atom(get => {
	const dodgeSign = get(dodgeSignAtom);
	return dodgeSign * get(proficiencyBonusAtom);
});
const internalProficiencyBonusAtom = atom(2);
export const proficiencyBonusAtom = atom(
	get => get(internalProficiencyBonusAtom),
	(_, set, value: number) => {
		set(internalProficiencyBonusAtom, Math.max(value, 0));
	}
);

export const parryAtom = atom(false);

export const avoidedTextAtom = atom(get => {
	const weakSpot = get(weakSpotAtom);
	const dodgeState = get(dodgeStateAtom);
	const parryState = get(parryAtom);
	const avoidedAttack = get(avoidedAttackAtom);
	const inHitWindow = get(inHitWindowAtom);
	return (value: number) => {
		if (value === weakSpot) {
			return 'Critical Hit';
		}
		if (avoidedAttack(value)) {
			if (dodgeState !== 'disabled') {
				return 'Dodge';
			} else if (parryState) {
				return 'Parry';
			}
		} else {
			return inHitWindow(value) ? 'Hit' : 'Miss';
		}
		return 'Miss';
	};
});
