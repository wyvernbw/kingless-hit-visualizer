import { atom, useAtom, useAtomValue } from 'jotai';

const internalWeakSpotAtom = atom(10);
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
export const acAtom = atom(15);

export const hitWindowAtom = atom(get => {
	const weakSpot = get(weakSpotAtom);
	const internalWeakSpot = get(internalWeakSpotAtom);
	const ac = get(acAtom);
	const dodgeOffset = get(dodgeOffsetAtom);
	const dodgeSign = get(dodgeSignAtom);
	const hitWindowLen = Math.max(20 - ac, 0);
	const rightPadding = hitWindowLen % 2;
	const halfLen = Math.floor(hitWindowLen / 2);
	return {
		internalHitWindow: {
			start: internalWeakSpot - halfLen,
			end: internalWeakSpot + halfLen + rightPadding,
		},
		start: weakSpot - halfLen,
		end: weakSpot + halfLen + rightPadding,
	};
});

export const useInHitWindow = () => {
	const range = useAtomValue(hitWindowAtom);
	return (value: number) => value >= range.start && value <= range.end;
};
export const useInInternalHitWindow = () => {
	const range = useAtomValue(hitWindowAtom);
	return (value: number) =>
		value >= range.internalHitWindow.start &&
		value <= range.internalHitWindow.end;
};
export const useInDodgeWindow = (value: number) => {
	const inHitWindow = useInHitWindow();
	const inInternalHitWindow = useInInternalHitWindow();
	return (value: number) => inInternalHitWindow(value) && !inHitWindow(value);
};

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
export const proficiencyBonusAtom = atom(2);
