import { SVGProps } from "@/types/globals";
import Svg, { Path } from 'react-native-svg';

export default function ArrowLeft({width, color}: SVGProps) {
    return (
        <Svg stroke={color} width={width} height={width} fill="none" viewBox={`0 0 ${width} ${width}`} strokeWidth={2}>
            <Path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
        </Svg>
    )
}