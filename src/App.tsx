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

export const App = () => {
	return (
		<div className="h-screen w-screen p-4">
			<main className="h-full w-full items-center place-content-center flex flex-col gap-8">
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
		<div {...props} className={twMerge('flex gap-2', props.className)}>
			{Array.from({ length: 20 }, (_x, i) => i + 1).map(el => {
				const style = numberStyle(el);
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
		<div className="flex gap-2 flex-col items-center">
			<div className="grid gap-2 auto-cols-min grid-rows-2">
				<div className="col-start-1 col-span-1 flex gap-2 items-center mx-8">
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
				<div className="flex gap-2 items-center col-start-1 col-span-1 mx-8">
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
			<div className="grid gap-8 grid-cols-3 grid-rows-1 justify-items-center items-center">
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
				<div className="col-start-3">
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

const ParryInput = (props: ComponentProps<'div'>) => {
	const [parryState, setParryState] = useAtom(parryAtom);
	const dodgeState = useAtomValue(dodgeStateAtom);
	return (
		<div
			{...props}
			className={twMerge(props.className, 'flex gap-2 items-center')}
		>
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
	);
};
