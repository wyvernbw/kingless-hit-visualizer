import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { Input } from './components/ui/input';
import {
	acAtom,
	DodgeState,
	dodgeStateAtom,
	parryAtom,
	proficiencyBonusAtom,
	weakSpotAtom,
	avoidedTextAtom,
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
import clsx from 'clsx';

export const App = () => {
	return (
		<div className="h-screen w-screen p-4 md:items-center md:justify-center flex flex-col">
			<main className="h-full w-full md:items-center md:justify-center md:place-content-center flex lg:flex-col gap-8 md:flex-row flex-wrap max-w-max">
				<div className="flex flex-row md:flex-col md:gap-4 gap-2 md:items-center">
					<div className="flex flex-col gap-8 md:items-center max-w-max">
						<H1 className="w-1/2">~ Kingless Hit Visualizer ~</H1>
						<Inputs />
					</div>
					<HitLine className="flex-grow" />
				</div>
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
	const setWeakSpot = useSetAtom(weakSpotAtom);
	const avoidedText = useAtomValue(avoidedTextAtom);
	const numberStyle = (el: number) => {
		const avoid = avoidedText(el);
		if (avoid === 'Dodge') {
			return 'text-cyan-500';
		} else if (avoid === 'Parry') {
			return 'text-pink-500';
		} else if (avoid === 'Hit') {
			return 'text-orange-400';
		} else if (avoid === 'Critical Hit') {
			return 'text-red-500 font-bold';
		} else {
			return '';
		}
	};
	return (
		<div
			{...props}
			className={twMerge(
				'flex gap-2 flex-col md:flex-row ',
				props.className
			)}
		>
			{Array.from({ length: 20 }, (_x, i) => i + 1).map(el => {
				const style = numberStyle(el);
				return (
					<Tooltip key={el}>
						<TooltipTrigger asChild>
							<Button
								variant="outline"
								size="icon"
								className={twMerge(
									style,
									'w-6 h-6 aspect-square md:w-10 md:h-10'
								)}
								key={el}
								onClick={() => setWeakSpot(el)}
							>
								{el}
							</Button>
						</TooltipTrigger>
						<TooltipContent
							className={twMerge(
								'outline-[1px] outline-zinc-700 bg-opacity-100 bg-background p-2 rounded-md outline',
								style
							)}
						>
							<p>{avoidedText(el)}</p>
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
		<div className="flex gap-2 flex-col md:items-center  md:justify-normal max-w-max">
			<div className="md:grid gap-2 auto-cols-min grid-rows-2 flex flex-col max-w-max">
				<div className="md:col-start-1 md:col-span-1 flex md:gap-2 md:items-center md:mx-8 gap-4 w-min">
					<img
						src="https://terraria.wiki.gg/images/5/53/Lead_Broadsword.png"
						alt=""
						className="aspect-square h-[32px] [image-rendering:pixelated] hidden md:block"
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
					className="min-w-16 max-w-min text-red-500 col-start-2"
					type="number"
					defaultValue={weakSpot}
					value={weakSpot}
					onChange={e => setWeakSpot(parseInt(e.target.value))}
				/>
				<div className="flex gap-2 items-center col-start-1 col-span-1 md:mx-8 w-min">
					<img
						src="https://terraria.wiki.gg/images/7/7a/Lead_Chainmail.png"
						alt=""
						className="h-[24px] [image-rendering:pixelated] hidden md:block"
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
					className="min-w-16 max-w-min col-start-2"
					type="number"
					defaultValue={ac}
					onChange={e => setAc(parseInt(e.target.value))}
				/>
			</div>
			<div className="md:grid flex flex-col gap-4 md:gap-8 grid-cols-1 grid-rows-3 md:grid-cols-3 md:grid-rows-1 md:justify-items-center md:items-center">
				<div>
					<Label htmlFor="proficiency-bonus">Proficiency bonus</Label>
					<Input
						type="number"
						className="min-w-16 max-w-min"
						id="proficiency-bonus"
						defaultValue={2}
						onChange={e =>
							setProficiencyBonus(parseInt(e.target.value))
						}
					/>
				</div>
				<div className="md:col-start-2 md:row-start-1 row-start-2">
					<DodgeInput />
				</div>
				<div className="md:col-start-3 md:row-start-1 row-start-3">
					<ParryInput />
				</div>{' '}
			</div>
		</div>
	);
};

const DodgeInput = (props: ComponentProps<'div'>) => {
	const [dodgeState, setDodgeState] = useAtom(dodgeStateAtom);
	const parryState = useAtomValue(parryAtom);
	return (
		<div
			{...props}
			className={twMerge(props.className, 'flex gap-2 flex-col')}
		>
			<div className="flex gap-2 items-center">
				<Switch
					disabled={parryState}
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
				defaultValue={'left'}
				onValueChange={value => setDodgeState(value as DodgeState)}
			>
				<SelectTrigger className="min-w-16 max-w-min">
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

const ParryInput = (props: ComponentProps<'div'>) => {
	const [parryState, setParryState] = useAtom(parryAtom);
	const dodgeState = useAtomValue(dodgeStateAtom);
	const proficiencyBonus = useAtomValue(proficiencyBonusAtom);
	return (
		<div
			{...props}
			className={twMerge(props.className, 'flex flex-col gap-2')}
		>
			<div className="flex gap-2 items-center">
				<Switch
					disabled={dodgeState !== 'disabled'}
					onCheckedChange={value => setParryState(value)}
					defaultChecked={parryState}
					id="parry-enabled"
					className="data-[state=checked]:bg-pink-500"
				/>
				<Label htmlFor="parry-enabled" className="text-pink-500">
					Parry
				</Label>
			</div>
			<span
				aria-disabled={parryState}
				className={clsx(
					'text-pink-500',
					!parryState && 'text-opacity-50'
				)}
			>
				+{proficiencyBonus} AC
			</span>
		</div>
	);
};
