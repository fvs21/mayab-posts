import { SVGProps } from "@/types/globals";
import { memo } from "react";
import Svg, { Path } from "react-native-svg";

function CheckLgSVG({ width, color }: SVGProps) {
    const props = {
        width: width,
        height: width,
        fill: color || "black",
        viewBox: "0 0 16 16"
    };

    return (
        <Svg {...props}>
            <Path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425z"/>
        </Svg>
    );
}

export default memo(CheckLgSVG); 