import { atom, useAtom } from 'jotai';

export const weakSpotAtom = atom(10);
export const acAtom = atom(15);

export const hitWindowAtom = atom(get => {
	const weakSpot = get(weakSpotAtom);
	const ac = get(acAtom);
	const hitWindowLen = Math.max(20 - ac, 0);
	const rightPadding = hitWindowLen % 2;
	const halfLen = Math.floor(hitWindowLen / 2);
	return {
		start: weakSpot - halfLen,
		end: weakSpot + halfLen + rightPadding,
	};
});

export const inHitWindow = (value: number) => {
	const [range, ..._rest] = useAtom(hitWindowAtom);
	return value >= range.start && value <= range.end;
};
