import { useAtom } from 'jotai';
import { Input } from './components/ui/input';
import { acAtom, inHitWindow, weakSpotAtom } from './state';
import { Label } from './components/ui/label';
import { twMerge } from 'tailwind-merge';
import { ComponentProps } from 'react';

export const App = () => {
	return (
		<div className="h-screen w-screen p-4">
			<main className="h-full w-full items-center place-content-center flex flex-col gap-2">
				<h1>~ Kingless Hit Visualizer ~</h1>
				<Inputs />
				<HitLine className="my-4" />
			</main>
		</div>
	);
};

const HitLine = (props: Partial<ComponentProps<'div'>>) => {
	const [weakSpot, _setWeakSpot] = useAtom(weakSpotAtom);
	const numberStyle = (el: number) => {
		const inHitStyle = inHitWindow(el) ? 'text-orange-400' : '';
		const isWeakSpotStyle = el === weakSpot ? 'text-red-500 font-bold' : '';
		return twMerge(inHitStyle, isWeakSpotStyle);
	};
	return (
		<div {...props} className={twMerge('flex gap-2', props.className)}>
			{Array.from({ length: 20 }, (_x, i) => i + 1).map(el => (
				<span className={numberStyle(el)} key={el}>
					{el}
				</span>
			))}
		</div>
	);
};

const Inputs = () => {
	const [weakSpot, setWeakSpot] = useAtom(weakSpotAtom);
	const [ac, setAc] = useAtom(acAtom);
	return (
		<div className="flex gap-2 w-min">
			<div>
				<Label
					className="text-red-500 flex gap-2 items-center"
					htmlFor="weakspot-input"
				>
					Weak spot
					<img
						src="https://terraria.wiki.gg/images/5/53/Lead_Broadsword.png"
						alt=""
						className="[image-rendering:pixelated] h-[32px] my-1"
					/>
				</Label>
				<Input
					id="weakspot-input"
					className="w-28 text-[2rem] text-red-500"
					type="number"
					defaultValue={weakSpot}
					onChange={e => setWeakSpot(parseInt(e.target.value))}
				/>
			</div>
			<div>
				<Label className="flex gap-2 items-center" htmlFor="ac-input">
					AC
					<img
						src="https://terraria.wiki.gg/images/5/54/Squire%27s_Shield.png"
						alt=""
						className="[image-rendering:pixelated] h-[32px] my-1"
					/>
				</Label>
				<Input
					id="ac-input"
					className="w-28 text-[2rem]"
					type="number"
					defaultValue={ac}
					onChange={e => setAc(parseInt(e.target.value))}
				/>
			</div>
		</div>
	);
};
