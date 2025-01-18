import { useAtom, useSetAtom } from 'jotai';
import { Input } from './components/ui/input';
import {
	acAtom,
	DodgeState,
	dodgeStateAtom,
	proficiencyBonusAtom,
	useInDodgeWindow,
	useInHitWindow,
	weakSpotAtom,
} from './state';
import { Label } from './components/ui/label';
import { twMerge } from 'tailwind-merge';
import { ComponentProps } from 'react';
import { Tooltip, TooltipTrigger } from './components/ui/tooltip';
import { TooltipContent } from '@radix-ui/react-tooltip';
import { Button } from './components/ui/button';
import { Card, CardContent, CardHeader } from './components/ui/card';
import { H1, H2, InlineCode } from './components/ui/typography';
import { Switch } from './components/ui/switch';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from './components/ui/select';

export const App = () => {
	return (
		<div className="h-screen w-screen p-4">
			<main className="h-full w-full items-center place-content-center flex flex-col gap-4">
				<H1>~ Kingless Hit Visualizer ~</H1>
				<Inputs />
				<HitLine className="" />
				<Card className="w-[30rem]">
					<CardHeader>
						<H2>Rule Reference</H2>
					</CardHeader>
					<CardContent>
						<ul className="ml-6 list-disc text-sm flex flex-col gap-2 leading-none">
							<li>
								<span className="text-red-500">
									Critical Hit
								</span>
								: Limb loss / long lasting internal injury, for
								damage take max value and double (2d6 {'->'} 2 *
								6 * 2 = 24)
							</li>
							<li>
								<span className="text-red-500">Bleeding</span>:
								<InlineCode>Piercing</InlineCode> or{' '}
								<InlineCode>Slashing</InlineCode> damage
								inflicts bleeding.
							</li>
							<li>
								Hit window = 20 - AC, hits outside of this
								window are misses
							</li>
							<li>Upon reaching 0 HP, you are staggered.</li>
						</ul>{' '}
					</CardContent>
				</Card>
			</main>
		</div>
	);
};

const HitLine = (props: Partial<ComponentProps<'div'>>) => {
	const [weakSpot, setWeakSpot] = useAtom(weakSpotAtom);
	const numberStyle = (el: number) => {
		const inHitStyle = inHitWindow(el) ? 'text-orange-400' : '';
		const isWeakSpotStyle = el === weakSpot ? 'text-red-500 font-bold' : '';
		const isDodgeStyle = inDodgeWindow(el) ? 'text-cyan-500' : '';
		return twMerge(inHitStyle, isWeakSpotStyle, isDodgeStyle);
	};
	const inHitWindow = useInHitWindow();
	const inDodgeWindow = useInDodgeWindow();
	return (
		<div {...props} className={twMerge('flex gap-2', props.className)}>
			{Array.from({ length: 20 }, (_x, i) => i + 1).map(el => {
				const style = numberStyle(el);
				const hit = inHitWindow(el);
				const dodge = inDodgeWindow(el);
				return (
					<Tooltip key={el}>
						<TooltipTrigger asChild>
							<Button
								variant="outline"
								size="icon"
								className={style}
								key={el}
								onClick={() => setWeakSpot(el)}
							>
								{el}
							</Button>
						</TooltipTrigger>
						<TooltipContent
							className={twMerge(
								'outline-1 outline-white',
								style
							)}
						>
							<p>
								{hit
									? weakSpot == el
										? 'Critical Hit'
										: 'Hit'
									: dodge
									? 'Dodge'
									: 'Miss'}
							</p>
						</TooltipContent>
					</Tooltip>
				);
			})}
		</div>
	);
};

const Inputs = () => {
	const [weakSpot, setWeakSpot] = useAtom(weakSpotAtom);
	const [ac, setAc] = useAtom(acAtom);
	const setProficiencyBonus = useSetAtom(proficiencyBonusAtom);
	return (
		<div className="flex gap-8">
			<div className="grid gap-2 grid-cols-2 grid-rows-2 col-start-1">
				<div className="col-start-1 col-span-1 flex gap-2 items-center">
					<img
						src="https://terraria.wiki.gg/images/5/53/Lead_Broadsword.png"
						alt=""
						className="aspect-square h-[32px] [image-rendering:pixelated]"
					/>
					<Label
						className="text-red-500 flex gap-2 items-center"
						htmlFor="weakspot-input"
					>
						Weak spot
					</Label>
				</div>
				<Input
					id="weakspot-input"
					className="w-28 text-[2rem] text-red-500 col-start-2"
					type="number"
					defaultValue={weakSpot}
					onChange={e => setWeakSpot(parseInt(e.target.value))}
				/>
				<div className="flex gap-2 items-center col-start-1 col-span-1">
					<img
						src="https://terraria.wiki.gg/images/7/7a/Lead_Chainmail.png"
						alt=""
						className="h-[24px] [image-rendering:pixelated]"
					/>
					<Label
						className="flex gap-2 items-center col-start-1 col-span-1"
						htmlFor="ac-input"
					>
						AC
					</Label>
				</div>
				<Input
					id="ac-input"
					className="w-28 text-[2rem] col-start-2"
					type="number"
					defaultValue={ac}
					onChange={e => setAc(parseInt(e.target.value))}
				/>
			</div>
			<div>
				<Label htmlFor="proficiency-bonus">Proficiency bonus</Label>
				<Input
					type="number"
					className="w-28"
					id="proficiency-bonus"
					defaultValue={2}
					onChange={e =>
						setProficiencyBonus(parseInt(e.target.value))
					}
				/>
			</div>
			<div className="col-start-2">
				<DodgeInput />
			</div>
		</div>
	);
};

const DodgeInput = (props: ComponentProps<'div'>) => {
	const [dodgeState, setDodgeState] = useAtom(dodgeStateAtom);
	return (
		<div
			{...props}
			className={twMerge(props.className, 'flex gap-2 flex-col')}
		>
			<div className="flex gap-2 items-center">
				<Switch
					onCheckedChange={value =>
						setDodgeState(value ? 'left' : 'disabled')
					}
					defaultChecked={dodgeState !== 'disabled'}
					id="dodge-enabled"
					className="data-[state=checked]:bg-cyan-500"
				/>
				<Label htmlFor="dodge-enabled" className="text-cyan-500">
					Dodge
				</Label>
			</div>
			<Select
				disabled={dodgeState === 'disabled'}
				onValueChange={value => setDodgeState(value as DodgeState)}
			>
				<SelectTrigger className="w-[180px]">
					<SelectValue placeholder="Side" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="left">Left</SelectItem>
					<SelectItem value="right">Right</SelectItem>
				</SelectContent>{' '}
			</Select>
		</div>
	);
};
