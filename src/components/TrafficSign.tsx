import Svg, { Circle, ClipPath, Defs, G, Line, Path, Polygon, Rect, Text as SvgText } from 'react-native-svg';

import { SIGN_NAMES } from '@/data/signs';
import type { SignId } from '@/data/types';
import { Fonts } from '@/theme';

export { SIGN_NAMES };

const RED = '#d01d21';
const BLUE = '#0850ab';
const YELLOW = '#f9cc21';
const WHITE = '#fcfcfc';
const BLACK = '#0b0b0b';
const SIGN_FONT = Fonts.bodyExtra;

function TriangleUp({ children }: { children?: React.ReactNode }) {
  return (
    <>
      <Polygon
        points="50,8 94,86 6,86"
        fill={WHITE}
        stroke={RED}
        strokeWidth={9}
        strokeLinejoin="round"
      />
      {children}
    </>
  );
}

function ProhibitionDisc({ children }: { children?: React.ReactNode }) {
  return (
    <>
      <Circle cx={50} cy={50} r={44} fill={WHITE} stroke={RED} strokeWidth={10} />
      {children}
    </>
  );
}

function BlueSquare({ children }: { children?: React.ReactNode }) {
  return (
    <>
      <Rect x={6} y={6} width={88} height={88} rx={8} fill={BLUE} />
      <Rect x={10} y={10} width={80} height={80} rx={6} fill="none" stroke={WHITE} strokeWidth={2} />
      {children}
    </>
  );
}

function Car({ x, color }: { x: number; color: string }) {
  return (
    <G>
      <Path d={`M${x + 4} 52 L${x + 8} 40 L${x + 18} 40 L${x + 22} 52 Z`} fill={color} />
      <Rect x={x} y={50} width={26} height={12} rx={3} fill={color} />
      <Rect x={x + 2} y={60} width={6} height={6} rx={1.5} fill={color} />
      <Rect x={x + 18} y={60} width={6} height={6} rx={1.5} fill={color} />
    </G>
  );
}

function Diamond({ ended }: { ended?: boolean }) {
  return (
    <>
      <Polygon points="50,3 97,50 50,97 3,50" fill={WHITE} stroke="#8a8a8a" strokeWidth={1.5} />
      <Polygon points="50,17 83,50 50,83 17,50" fill={ended ? '#e7c54a' : YELLOW} />
      {ended && (
        <>
          <Defs>
            <ClipPath id="diamond-clip">
              <Polygon points="50,3 97,50 50,97 3,50" />
            </ClipPath>
          </Defs>
          <G clipPath="url(#diamond-clip)">
            {[-14, -7, 0, 7, 14].map((o) => (
              <Line
                key={o}
                x1={10 + o}
                y1={90 + o}
                x2={90 + o}
                y2={10 + o}
                stroke={BLACK}
                strokeWidth={2.2}
              />
            ))}
          </G>
        </>
      )}
    </>
  );
}

function SignShape({ id }: { id: SignId }) {
  switch (id) {
    case '101':
      return (
        <TriangleUp>
          <Rect x={45.5} y={36} width={9} height={30} rx={3} fill={BLACK} />
          <Circle cx={50} cy={75} r={5} fill={BLACK} />
        </TriangleUp>
      );
    case '301':
      return (
        <TriangleUp>
          <Rect x={45.5} y={36} width={9} height={42} rx={1} fill={BLACK} />
          <Rect x={33} y={52} width={34} height={5} rx={1} fill={BLACK} />
        </TriangleUp>
      );
    case '205':
      return (
        <Polygon
          points="6,14 94,14 50,92"
          fill={WHITE}
          stroke={RED}
          strokeWidth={9}
          strokeLinejoin="round"
        />
      );
    case '206': {
      const pts = Array.from({ length: 8 }, (_, i) => {
        const a = (Math.PI / 8) * (2 * i + 1);
        return `${50 + 46 * Math.cos(a)},${50 + 46 * Math.sin(a)}`;
      }).join(' ');
      const inner = Array.from({ length: 8 }, (_, i) => {
        const a = (Math.PI / 8) * (2 * i + 1);
        return `${50 + 42 * Math.cos(a)},${50 + 42 * Math.sin(a)}`;
      }).join(' ');
      return (
        <>
          <Polygon points={pts} fill={WHITE} />
          <Polygon points={inner} fill={RED} />
          <SvgText x={50} y={59} fontSize={25} fontFamily={SIGN_FONT} fill={WHITE} textAnchor="middle">
            STOP
          </SvgText>
        </>
      );
    }
    case '209':
      return (
        <>
          <Circle cx={50} cy={50} r={46} fill={BLUE} />
          <Circle cx={50} cy={50} r={43} fill="none" stroke={WHITE} strokeWidth={1.5} />
          <Path d="M38 80 L38 54 Q38 40 52 40 L62 40" stroke={WHITE} strokeWidth={11} fill="none" />
          <Polygon points="60,25 80,40 60,55" fill={WHITE} />
        </>
      );
    case '250':
      return <ProhibitionDisc />;
    case '267':
      return (
        <>
          <Circle cx={50} cy={50} r={46} fill={RED} stroke={WHITE} strokeWidth={2} />
          <Rect x={17} y={41} width={66} height={18} fill={WHITE} />
        </>
      );
    case '274-30':
    case '274-50':
    case '274-70':
      return (
        <ProhibitionDisc>
          <SvgText x={50} y={63} fontSize={38} fontFamily={SIGN_FONT} fill={BLACK} textAnchor="middle">
            {id.split('-')[1]}
          </SvgText>
        </ProhibitionDisc>
      );
    case '276':
      return (
        <ProhibitionDisc>
          <Car x={21} color={RED} />
          <Car x={53} color={BLACK} />
        </ProhibitionDisc>
      );
    case '282':
      return (
        <>
          <Defs>
            <ClipPath id="disc-282">
              <Circle cx={50} cy={50} r={44} />
            </ClipPath>
          </Defs>
          <Circle cx={50} cy={50} r={46} fill={WHITE} stroke="#5f5f5f" strokeWidth={2} />
          <G clipPath="url(#disc-282)">
            {[-18, -9, 0, 9, 18].map((o) => (
              <Line
                key={o}
                x1={0 + o}
                y1={100 + o}
                x2={100 + o}
                y2={0 + o}
                stroke={BLACK}
                strokeWidth={2.5}
              />
            ))}
          </G>
        </>
      );
    case '283':
    case '286':
      return (
        <>
          <Defs>
            <ClipPath id={`disc-${id}`}>
              <Circle cx={50} cy={50} r={40} />
            </ClipPath>
          </Defs>
          <Circle cx={50} cy={50} r={40} fill={BLUE} stroke={RED} strokeWidth={10} />
          <G clipPath={`url(#disc-${id})`}>
            <Line x1={18} y1={18} x2={82} y2={82} stroke={RED} strokeWidth={10} />
            {id === '283' && <Line x1={82} y1={18} x2={18} y2={82} stroke={RED} strokeWidth={10} />}
          </G>
          <Circle cx={50} cy={50} r={46} fill="none" stroke={WHITE} strokeWidth={2} />
        </>
      );
    case '306':
      return <Diamond />;
    case '307':
      return <Diamond ended />;
    case '310':
      return (
        <>
          <Rect x={4} y={24} width={92} height={52} rx={5} fill={YELLOW} />
          <Rect x={8} y={28} width={84} height={44} rx={3} fill="none" stroke={BLACK} strokeWidth={2} />
          <SvgText x={50} y={55} fontSize={14} fontFamily={SIGN_FONT} fill={BLACK} textAnchor="middle">
            Musterstadt
          </SvgText>
        </>
      );
    case '314':
      return (
        <BlueSquare>
          <SvgText x={50} y={72} fontSize={62} fontFamily={SIGN_FONT} fill={WHITE} textAnchor="middle">
            P
          </SvgText>
        </BlueSquare>
      );
    case '357':
      return (
        <BlueSquare>
          <Rect x={43} y={36} width={14} height={48} fill={WHITE} />
          <Rect x={24} y={22} width={52} height={15} fill={RED} />
        </BlueSquare>
      );
    case '380':
      return (
        <BlueSquare>
          <SvgText x={50} y={63} fontSize={34} fontFamily={SIGN_FONT} fill={WHITE} textAnchor="middle">
            130
          </SvgText>
        </BlueSquare>
      );
    case '201':
      return (
        <>
          {[32, -32].map((angle) => (
            <G key={angle} transform={`rotate(${angle} 50 50)`}>
              <Rect x={2} y={43} width={96} height={14} fill={WHITE} stroke={RED} strokeWidth={2} />
              {[2, 40, 78].map((x) => (
                <Rect key={x} x={x} y={43} width={20} height={14} fill={RED} />
              ))}
            </G>
          ))}
        </>
      );
    default:
      return null;
  }
}

export function TrafficSign({ id, size = 96 }: { id: SignId; size?: number }) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      accessibilityRole="image"
      accessibilityLabel={SIGN_NAMES[id]}>
      <SignShape id={id} />
    </Svg>
  );
}
